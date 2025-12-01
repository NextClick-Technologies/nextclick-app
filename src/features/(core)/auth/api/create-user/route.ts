import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserByEmail,
  createUser,
  createAuditLog,
} from "@/lib/supabase/auth-client";
import {
  hashPassword,
  generateRandomPassword,
  generateSecureToken,
  getTokenExpiration,
} from "../../services/password";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
} from "@/lib/email/auth-emails";
import type { CreateUserInput } from "@/types/auth.types";
import { logger } from "@/lib/logger";

/**
 * POST /api/auth/create-user
 * Create a new user (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    logger.info("CREATE USER REQUEST RECEIVED");

    // Check authentication and admin role
    const session = await auth();

    if (!session?.user) {
      logger.warn("Unauthorized create-user attempt - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      logger.warn(
        { userId: session.user.id, role: session.user.role },
        "Forbidden - non-admin tried to create user"
      );
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: CreateUserInput = await request.json();
    const { email, role } = body;

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["admin", "manager", "employee", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role. Must be one of: admin, manager, employee, viewer",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Generate random password
    const tempPassword = generateRandomPassword();
    const passwordHash = await hashPassword(tempPassword);

    // Generate email verification token
    const verificationToken = generateSecureToken();
    const verificationExpires = getTokenExpiration(24); // 24 hours

    // Create user in database
    const { data: newUser, error: createError } = await createUser({
      email,
      password_hash: passwordHash,
      role,
      is_active: true,
      email_verified: false,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires.toISOString(),
    });

    if (createError) {
      logger.error({ err: createError, email }, "Error creating user");
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Send welcome email with temporary password
    try {
      await sendWelcomeEmail(email, tempPassword);
    } catch (emailError) {
      logger.warn({ err: emailError, email }, "Error sending welcome email");
      // Don't fail the request if email fails
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      logger.warn(
        { err: emailError, email },
        "Error sending verification email"
      );
      // Don't fail the request if email fails
    }

    // Log audit trail
    await createAuditLog({
      user_id: session.user.id,
      action: "create_user",
      resource_type: "user",
      resource_id: newUser!.id,
      details: {
        created_user_email: email,
        created_user_role: role,
      },
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "User created successfully. Welcome email sent with temporary password.",
        user: {
          id: newUser!.id,
          email: newUser!.email,
          role: newUser!.role,
          createdAt: newUser!.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error({ err: error }, "Error in create-user API");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
