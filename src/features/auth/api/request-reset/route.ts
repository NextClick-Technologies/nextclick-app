import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
  updateUser,
  createAuditLog,
} from "@/shared/lib/supabase/auth-client";
import {
  generateSecureToken,
  getTokenExpiration,
} from "../../services/password";
import { sendPasswordResetEmail } from "@/shared/lib/email/auth-emails";
import { logger } from "@/shared/lib/logger";

/**
 * POST /api/auth/request-reset
 * Request password reset link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const { data: user, error: userError } = await getUserByEmail(email);

    // Always return success to prevent email enumeration
    // Even if user doesn't exist, we return success
    if (userError || !user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      // Return success to prevent revealing account status
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account exists with this email, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const resetExpires = getTokenExpiration(1); // 1 hour

    // Update user with reset token
    const { error: updateError } = await updateUser(user!.id, {
      password_reset_token: resetToken,
      password_reset_expires: resetExpires.toISOString(),
    });

    if (updateError) {
      logger.error(
        { err: updateError, userId: user!.id },
        "Error updating user with reset token"
      );
      return NextResponse.json(
        { error: "Failed to process password reset request" },
        { status: 500 }
      );
    }

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      logger.warn(
        { err: emailError, email },
        "Error sending password reset email"
      );
      // Don't reveal email sending failure to user
    }

    // Log audit trail
    await createAuditLog({
      user_id: user!.id,
      action: "request_password_reset",
      resource_type: "user",
      resource_id: user!.id,
      details: {
        email: user!.email,
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
          "If an account exists with this email, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ err: error }, "Error in request-reset API");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
