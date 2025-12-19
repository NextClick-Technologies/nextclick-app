/**
 * Create User Handler
 * Admin-only endpoint to create new users using Supabase Auth Admin API
 */
import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  supabaseAdmin,
} from "@/shared/lib/supabase/server";
import { createAuditLog } from "@/shared/lib/supabase/auth-client";
import { sendWelcomeEmail } from "@/shared/lib/email/auth-emails";
import type { UserRole } from "@/shared/types/auth.types";
import { logger } from "@/shared/lib/logs/logger";

interface CreateUserInput {
  email: string;
  role: UserRole;
  password?: string; // Optional - if not provided, a random one will be generated
}

/**
 * Generate a random password
 */
function generateRandomPassword(): string {
  const length = 16;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  // Ensure at least one of each required type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

/**
 * POST /api/auth/create-user
 * Create a new user (Admin only)
 */
export async function createUserHandler(request: NextRequest) {
  try {
    logger.info("CREATE USER REQUEST RECEIVED");

    // Get current user session
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      logger.warn("Unauthorized create-user attempt - no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if current user is admin
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    const userRecord = userData as { role: string } | null;

    if (!userRecord || userRecord.role !== "admin") {
      logger.warn(
        { userId: currentUser.id, role: userRecord?.role },
        "Forbidden - non-admin tried to create user"
      );
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: CreateUserInput = await request.json();
    const { email, role, password } = body;

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ["admin", "manager", "employee", "viewer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          error:
            "Invalid role. Must be one of: admin, manager, employee, viewer",
        },
        { status: 400 }
      );
    }

    // Generate password if not provided
    const userPassword = password || generateRandomPassword();

    // Create user in Supabase Auth
    // The trigger will automatically create the record in public.users
    const { data: authData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: userPassword,
        email_confirm: true, // Auto-confirm email for admin-created users
        user_metadata: { role }, // This will be picked up by the trigger
      });

    if (createError || !authData.user) {
      logger.error(
        { err: createError },
        "Error creating user in Supabase Auth"
      );

      // Handle specific error cases
      if (createError?.message?.includes("already been registered")) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: createError?.message || "Failed to create user" },
        { status: 500 }
      );
    }

    const newUser = authData.user;

    // Send welcome email with temporary password
    try {
      await sendWelcomeEmail(email, userPassword);
    } catch (emailError) {
      logger.warn(
        { err: emailError, email },
        "Error sending welcome email - user was still created"
      );
      // Don't fail the request if email fails - user was created
    }

    // Log audit trail
    await createAuditLog({
      user_id: currentUser.id,
      action: "create_user",
      resource_type: "user",
      resource_id: newUser.id,
      details: {
        created_user_email: email,
        created_user_role: role,
      },
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    });

    logger.info(
      { userId: newUser.id, email, role },
      "User created successfully"
    );

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully. Welcome email sent.",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: role,
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
