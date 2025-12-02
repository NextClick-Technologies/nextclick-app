/**
 * Integration tests for Auth API Handlers
 * Tests authentication, authorization, and auth-related operations
 */

import { NextRequest, NextResponse } from "next/server";
import { createUserHandler } from "../api/create-user.handler";
import { requestResetHandler } from "../api/request-reset.handler";
import { resetPasswordHandler } from "../api/reset-password.handler";
import { verifyEmailHandler } from "../api/verify-email.handler";

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body: any, init?: ResponseInit) => {
      return {
        status: init?.status || 200,
        json: async () => body,
      };
    }),
  },
  NextRequest: jest.requireActual("next/server").NextRequest,
}));

// Mock dependencies
jest.mock("@/shared/lib/auth/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/shared/lib/supabase/auth-client", () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  createAuditLog: jest.fn(),
  updateUser: jest.fn(),
  getUserByResetToken: jest.fn(),
  getUserByVerificationToken: jest.fn(),
}));

jest.mock("../domain/password", () => ({
  hashPassword: jest.fn(),
  generateRandomPassword: jest.fn(),
  generateSecureToken: jest.fn(),
  getTokenExpiration: jest.fn(),
  validatePasswordStrength: jest.fn(),
  isTokenExpired: jest.fn(),
}));

jest.mock("@/shared/lib/email/auth-emails", () => ({
  sendWelcomeEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendPasswordChangedEmail: jest.fn(),
}));

jest.mock("@/shared/lib/logs/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

import { auth } from "@/shared/lib/auth/auth";
import {
  getUserByEmail,
  createUser,
  createAuditLog,
  updateUser,
  getUserByResetToken,
  getUserByVerificationToken,
} from "@/shared/lib/supabase/auth-client";
import {
  hashPassword,
  generateRandomPassword,
  generateSecureToken,
  getTokenExpiration,
  validatePasswordStrength,
  isTokenExpired,
} from "../domain/password";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "@/shared/lib/email/auth-emails";

describe("Auth Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserHandler", () => {
    const mockAdminSession = {
      user: {
        id: "admin-123",
        email: "admin@test.com",
        role: "admin",
      },
    };

    const createMockRequest = (body: any) => {
      return {
        json: jest.fn().mockResolvedValue(body),
        headers: {
          get: jest.fn().mockReturnValue("test-user-agent"),
        },
      } as unknown as NextRequest;
    };

    it("should return 401 if user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const request = createMockRequest({
        email: "test@test.com",
        role: "employee",
      });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 403 if user is not admin", async () => {
      (auth as jest.Mock).mockResolvedValue({
        user: { id: "user-123", role: "employee" },
      });
      const request = createMockRequest({
        email: "test@test.com",
        role: "employee",
      });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Forbidden - Admin access required");
    });

    it("should return 400 if email or role is missing", async () => {
      (auth as jest.Mock).mockResolvedValue(mockAdminSession);
      const request = createMockRequest({ email: "test@test.com" });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email and role are required");
    });

    it("should return 400 if role is invalid", async () => {
      (auth as jest.Mock).mockResolvedValue(mockAdminSession);
      const request = createMockRequest({
        email: "test@test.com",
        role: "superuser",
      });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid role");
    });

    it("should return 409 if user already exists", async () => {
      (auth as jest.Mock).mockResolvedValue(mockAdminSession);
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: { id: "existing-user", email: "test@test.com" },
        error: null,
      });
      const request = createMockRequest({
        email: "test@test.com",
        role: "employee",
      });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe("User with this email already exists");
    });

    it("should create user successfully", async () => {
      (auth as jest.Mock).mockResolvedValue(mockAdminSession);
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      (generateRandomPassword as jest.Mock).mockReturnValue("TempPass123!");
      (hashPassword as jest.Mock).mockResolvedValue("hashed-password");
      (generateSecureToken as jest.Mock).mockReturnValue("verification-token");
      (getTokenExpiration as jest.Mock).mockReturnValue(new Date());
      (createUser as jest.Mock).mockResolvedValue({
        data: {
          id: "new-user-id",
          email: "test@test.com",
          role: "employee",
        },
        error: null,
      });

      const request = createMockRequest({
        email: "test@test.com",
        role: "employee",
      });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.user.email).toBe("test@test.com");
      expect(createUser).toHaveBeenCalled();
      expect(sendWelcomeEmail).toHaveBeenCalledWith(
        "test@test.com",
        "TempPass123!"
      );
      expect(sendVerificationEmail).toHaveBeenCalledWith(
        "test@test.com",
        "verification-token"
      );
    });

    it("should return 500 if user creation fails", async () => {
      (auth as jest.Mock).mockResolvedValue(mockAdminSession);
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      (generateRandomPassword as jest.Mock).mockReturnValue("TempPass123!");
      (hashPassword as jest.Mock).mockResolvedValue("hashed-password");
      (generateSecureToken as jest.Mock).mockReturnValue("verification-token");
      (getTokenExpiration as jest.Mock).mockReturnValue(new Date());
      (createUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      const request = createMockRequest({
        email: "test@test.com",
        role: "employee",
      });

      const response = await createUserHandler(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create user");
    });
  });

  describe("requestResetHandler", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createMockRequest = (body: any) => {
      return {
        json: jest.fn().mockResolvedValue(body),
        headers: {
          get: jest.fn().mockReturnValue("test-user-agent"),
        },
      } as unknown as NextRequest;
    };

    it("should return 400 if email is missing", async () => {
      const request = createMockRequest({});

      const response = await requestResetHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Email is required");
    });

    it("should return success even if user does not exist (prevent enumeration)", async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      const request = createMockRequest({ email: "nonexistent@test.com" });

      const response = await requestResetHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("If an account exists");
    });

    it("should return success even if user is inactive (prevent enumeration)", async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: { id: "user-123", email: "test@test.com", is_active: false },
        error: null,
      });
      const request = createMockRequest({ email: "test@test.com" });

      const response = await requestResetHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should generate reset token and send email for active user", async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: { id: "user-123", email: "test@test.com", is_active: true },
        error: null,
      });
      (generateSecureToken as jest.Mock).mockReturnValue("reset-token");
      (getTokenExpiration as jest.Mock).mockReturnValue(new Date());
      (updateUser as jest.Mock).mockResolvedValue({ error: null });

      const request = createMockRequest({ email: "test@test.com" });

      const response = await requestResetHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(updateUser).toHaveBeenCalledWith("user-123", expect.any(Object));
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        "test@test.com",
        "reset-token"
      );
      expect(createAuditLog).toHaveBeenCalled();
    });

    it("should return 500 if update fails", async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue({
        data: { id: "user-123", email: "test@test.com", is_active: true },
        error: null,
      });
      (generateSecureToken as jest.Mock).mockReturnValue("reset-token");
      (getTokenExpiration as jest.Mock).mockReturnValue(new Date());
      (updateUser as jest.Mock).mockResolvedValue({
        error: { message: "Update failed" },
      });

      const request = createMockRequest({ email: "test@test.com" });

      const response = await requestResetHandler(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to process password reset request");
    });
  });

  describe("resetPasswordHandler", () => {
    const createMockRequest = (body: any) => {
      return {
        json: jest.fn().mockResolvedValue(body),
        headers: {
          get: jest.fn().mockReturnValue("test-user-agent"),
        },
      } as unknown as NextRequest;
    };

    it("should return 400 if token or password is missing", async () => {
      const request = createMockRequest({ token: "test-token" });

      const response = await resetPasswordHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Token and new password are required");
    });

    it("should return 400 if password is weak", async () => {
      (validatePasswordStrength as jest.Mock).mockReturnValue({
        valid: false,
        errors: ["Password too short"],
      });
      const request = createMockRequest({
        token: "test-token",
        newPassword: "weak",
      });

      const response = await resetPasswordHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Password does not meet requirements");
      expect(data.errors).toEqual(["Password too short"]);
    });

    it("should return 400 if token is invalid", async () => {
      (validatePasswordStrength as jest.Mock).mockReturnValue({ valid: true });
      (getUserByResetToken as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      const request = createMockRequest({
        token: "invalid-token",
        newPassword: "ValidPass123!",
      });

      const response = await resetPasswordHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid or expired reset token");
    });

    it("should return 400 if token is expired", async () => {
      (validatePasswordStrength as jest.Mock).mockReturnValue({ valid: true });
      (getUserByResetToken as jest.Mock).mockResolvedValue({
        data: {
          id: "user-123",
          email: "test@test.com",
          password_reset_expires: new Date().toISOString(),
        },
        error: null,
      });
      (isTokenExpired as jest.Mock).mockReturnValue(true);

      const request = createMockRequest({
        token: "expired-token",
        newPassword: "ValidPass123!",
      });

      const response = await resetPasswordHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("expired");
    });

    it("should reset password successfully", async () => {
      (validatePasswordStrength as jest.Mock).mockReturnValue({ valid: true });
      (getUserByResetToken as jest.Mock).mockResolvedValue({
        data: {
          id: "user-123",
          email: "test@test.com",
          password_reset_expires: new Date().toISOString(),
        },
        error: null,
      });
      (isTokenExpired as jest.Mock).mockReturnValue(false);
      (hashPassword as jest.Mock).mockResolvedValue("new-hashed-password");
      (updateUser as jest.Mock).mockResolvedValue({ error: null });

      const request = createMockRequest({
        token: "valid-token",
        newPassword: "NewValidPass123!",
      });

      const response = await resetPasswordHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(updateUser).toHaveBeenCalledWith("user-123", {
        password_hash: "new-hashed-password",
        password_reset_token: null,
        password_reset_expires: null,
      });
      expect(sendPasswordChangedEmail).toHaveBeenCalledWith("test@test.com");
      expect(createAuditLog).toHaveBeenCalled();
    });
  });

  describe("verifyEmailHandler", () => {
    const createMockRequest = (body: any) => {
      return {
        json: jest.fn().mockResolvedValue(body),
        headers: {
          get: jest.fn().mockReturnValue("test-user-agent"),
        },
      } as unknown as NextRequest;
    };

    it("should return 400 if token is missing", async () => {
      const request = createMockRequest({});

      const response = await verifyEmailHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Verification token is required");
    });

    it("should return 400 if token is invalid", async () => {
      (getUserByVerificationToken as jest.Mock).mockResolvedValue({
        data: null,
        error: null,
      });
      const request = createMockRequest({ token: "invalid-token" });

      const response = await verifyEmailHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid verification token");
    });

    it("should return 200 if email is already verified", async () => {
      (getUserByVerificationToken as jest.Mock).mockResolvedValue({
        data: {
          id: "user-123",
          email: "test@test.com",
          email_verified: true,
        },
        error: null,
      });
      const request = createMockRequest({ token: "valid-token" });

      const response = await verifyEmailHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Email already verified");
    });

    it("should return 400 if verification token is expired", async () => {
      (getUserByVerificationToken as jest.Mock).mockResolvedValue({
        data: {
          id: "user-123",
          email: "test@test.com",
          email_verified: false,
          email_verification_expires: new Date().toISOString(),
        },
        error: null,
      });
      (isTokenExpired as jest.Mock).mockReturnValue(true);

      const request = createMockRequest({ token: "expired-token" });

      const response = await verifyEmailHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("expired");
    });

    it("should verify email successfully", async () => {
      (getUserByVerificationToken as jest.Mock).mockResolvedValue({
        data: {
          id: "user-123",
          email: "test@test.com",
          email_verified: false,
          email_verification_expires: new Date().toISOString(),
        },
        error: null,
      });
      (isTokenExpired as jest.Mock).mockReturnValue(false);
      (updateUser as jest.Mock).mockResolvedValue({ error: null });

      const request = createMockRequest({ token: "valid-token" });

      const response = await verifyEmailHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        "Email verified successfully. You can now log in."
      );
      expect(updateUser).toHaveBeenCalledWith("user-123", {
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
      });
      expect(createAuditLog).toHaveBeenCalled();
    });

    it("should return 500 if update fails", async () => {
      (getUserByVerificationToken as jest.Mock).mockResolvedValue({
        data: {
          id: "user-123",
          email: "test@test.com",
          email_verified: false,
          email_verification_expires: new Date().toISOString(),
        },
        error: null,
      });
      (isTokenExpired as jest.Mock).mockReturnValue(false);
      (updateUser as jest.Mock).mockResolvedValue({
        error: { message: "Update failed" },
      });

      const request = createMockRequest({ token: "valid-token" });

      const response = await verifyEmailHandler(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to verify email");
    });
  });
});
