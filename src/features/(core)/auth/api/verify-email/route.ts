import { NextRequest, NextResponse } from "next/server";
import {
  getUserByVerificationToken,
  updateUser,
  createAuditLog,
} from "@/lib/supabase/auth-client";
import { isTokenExpired } from "@/lib/auth/password";
import { logger } from "@/lib/logger";

/**
 * POST /api/auth/verify-email
 * Verify user email address using token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user by verification token
    const { data: user, error: userError } = await getUserByVerificationToken(
      token
    );

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 }
      );
    }

    // Check if token has expired
    if (
      isTokenExpired(
        user.email_verification_expires
          ? new Date(user.email_verification_expires)
          : null
      )
    ) {
      return NextResponse.json(
        { error: "Verification token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Update user - mark email as verified and clear token
    const { error: updateError } = await updateUser(user!.id, {
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
    });

    if (updateError) {
      logger.error({ err: updateError, userId: user!.id }, "Error updating user");
      return NextResponse.json(
        { error: "Failed to verify email" },
        { status: 500 }
      );
    }

    // Log audit trail
    await createAuditLog({
      user_id: user!.id,
      action: "verify_email",
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
        message: "Email verified successfully. You can now log in.",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ err: error }, "Error in verify-email API");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
