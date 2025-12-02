import { Resend } from "resend";
import { logger } from "@/shared/lib/logs/logger";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@nextclick.com";
const APP_NAME = "NextClick ERP";
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

/**
 * Send email verification email
 * @param email - User email address
 * @param token - Email verification token
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Verify your email - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ${APP_NAME}!</h1>
            </div>
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">Verify Your Email Address</h2>
              <p style="font-size: 16px; line-height: 1.6;">Thank you for creating an account with ${APP_NAME}. To complete your registration, please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verifyUrl}" style="background: #667eea; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);">Verify Email Address</a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in <strong>24 hours</strong>.</p>
              <p style="color: #666; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    logger.error({ err: error, email }, "Failed to send verification email");
    throw new Error("Failed to send verification email");
  }
}

/**
 * Send password reset email
 * @param email - User email address
 * @param token - Password reset token
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Reset your password - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: #f44336; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
            </div>
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">Reset Your Password</h2>
              <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password for your ${APP_NAME} account. Click the button below to create a new password:</p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${resetUrl}" style="background: #f44336; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(244, 67, 54, 0.4);">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in <strong>1 hour</strong>.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #f44336; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    logger.error({ err: error, email }, "Failed to send password reset email");
    throw new Error("Failed to send password reset email");
  }
}

/**
 * Send password changed confirmation email
 * @param email - User email address
 */
export async function sendPasswordChangedEmail(email: string): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Password changed - ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: #4caf50; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Changed Successfully</h1>
            </div>
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">Your Password Has Been Updated</h2>
              <p style="font-size: 16px; line-height: 1.6;">This is a confirmation that your password for ${APP_NAME} was successfully changed.</p>
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 15px;">
                  <strong>⚠️ Security Alert:</strong><br>
                  If you didn't make this change, please contact your administrator immediately.
                </p>
              </div>
              <p style="color: #666; font-size: 14px;">For security reasons, you may want to review your recent account activity.</p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    logger.error(
      { err: error, email },
      "Failed to send password changed email"
    );
    // Don't throw - this is just a notification
  }
}

/**
 * Send welcome email after user creation
 * @param email - User email address
 * @param tempPassword - Temporary password
 */
export async function sendWelcomeEmail(
  email: string,
  tempPassword: string
): Promise<void> {
  const loginUrl = `${APP_URL}/auth/signin`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to ${APP_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ${APP_NAME}!</h1>
            </div>
            <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; font-size: 22px;">Your Account Has Been Created</h2>
              <p style="font-size: 16px; line-height: 1.6;">An administrator has created an account for you on ${APP_NAME}. Here are your login credentials:</p>
              <div style="background: #f8f9fa; border: 1px solid #dee2e6; padding: 25px; border-radius: 6px; margin: 25px 0;">
                <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0; font-size: 15px;"><strong>Temporary Password:</strong></p>
                <code style="background: #e9ecef; padding: 8px 12px; border-radius: 4px; display: inline-block; font-size: 16px; font-family: 'Courier New', monospace; margin-top: 5px;">${tempPassword}</code>
              </div>
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 15px;">
                  <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
                </p>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${loginUrl}" style="background: #667eea; color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);">Login to Your Account</a>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    logger.error({ err: error, email }, "Failed to send welcome email");
    throw new Error("Failed to send welcome email");
  }
}
