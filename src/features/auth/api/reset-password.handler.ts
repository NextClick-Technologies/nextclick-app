/**
 * Reset Password Handler
 * Reset password using reset token
 */
import { NextRequest, NextResponse } from "next/server";
import {
  getUserByResetToken,
  updateUser,
  createAuditLog,
} from "@/shared/lib/supabase/auth-client";
import {
  hashPassword,
  validatePasswordStrength,
  isTokenExpired,
} from "../domain/password";
import { sendPasswordChangedEmail } from "@/shared/lib/email/auth-emails";
import { logger } from "@/shared/lib/logs/logger";

/**
 * POST /api/auth/reset-password
 * Reset password using reset token
 */
export async function resetPasswordHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: "Password does not meet requirements",
          errors: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Find user by reset token
    const { data: user, error: userError } = await getUserByResetToken(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (
      isTokenExpired(
        user.password_reset_expires
          ? new Date(user.password_reset_expires)
          : null
      )
    ) {
      return NextResponse.json(
        { error: "Reset token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user - set new password and clear reset token
    const { error: updateError } = await updateUser(user!.id, {
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expires: null,
    });

    if (updateError) {
      logger.error(
        { err: updateError, userId: user!.id },
        "Error updating password"
      );
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 500 }
      );
    }

    // Send password changed confirmation email
    try {
      await sendPasswordChangedEmail(user!.email);
    } catch (emailError) {
      logger.warn(
        { err: emailError, email: user!.email },
        "Error sending password changed email"
      );
      // Don't fail the request if email fails
    }

    // Log audit trail
    await createAuditLog({
      user_id: user!.id,
      action: "reset_password",
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
        message: "Password reset successfully. You can now log in.",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ err: error }, "Error in reset-password API");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
