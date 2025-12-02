/**
 * Unit tests for password utilities
 * Tests password hashing, validation, and token generation
 */

// Mock nanoid before importing password utilities
jest.mock("nanoid", () => ({
  nanoid: jest.fn((size: number) => "a".repeat(size)),
}));

import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  generateRandomPassword,
  validatePasswordStrength,
  getTokenExpiration,
  isTokenExpired,
} from "@/shared/lib/auth/password";
import { nanoid } from "nanoid";

describe("Password Utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(30); // bcrypt hashes are typically 60 chars
    });

    it("should generate different hashes for the same password", async () => {
      const password = "TestPassword123!";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // bcrypt uses random salts
    });

    it("should handle empty password", async () => {
      const hash = await hashPassword("");
      expect(hash).toBeDefined();
    });

    it("should handle long passwords", async () => {
      const password = "a".repeat(100) + "A1!";
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword("WrongPassword123!", hash);

      expect(isValid).toBe(false);
    });

    it("should reject slightly different password", async () => {
      const password = "TestPassword123!";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword("TestPassword123", hash); // Missing !

      expect(isValid).toBe(false);
    });

    it("should handle empty password verification", async () => {
      const password = "";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword("", hash);

      expect(isValid).toBe(true);
    });
  });

  describe("generateSecureToken", () => {
    beforeEach(() => {
      // Reset mock to use incrementing tokens for uniqueness tests
      let counter = 0;
      (nanoid as jest.Mock).mockImplementation((size: number) =>
        `token_${counter++}_`.padEnd(size, "x")
      );
    });

    it("should generate a 32-character token", () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(32);
    });

    it("should generate unique tokens", () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      const token3 = generateSecureToken();

      expect(token1).not.toBe(token2);
      expect(token2).not.toBe(token3);
      expect(token1).not.toBe(token3);
    });

    it("should call nanoid with correct size", () => {
      generateSecureToken();
      expect(nanoid).toHaveBeenCalledWith(32);
    });

    it("should generate 100 unique tokens", () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateSecureToken());
      }
      expect(tokens.size).toBe(100);
    });
  });

  describe("generateRandomPassword", () => {
    it("should generate a 16-character password", () => {
      const password = generateRandomPassword();
      expect(password).toHaveLength(16);
    });

    it("should contain at least one uppercase letter", () => {
      const password = generateRandomPassword();
      expect(password).toMatch(/[A-Z]/);
    });

    it("should contain at least one lowercase letter", () => {
      const password = generateRandomPassword();
      expect(password).toMatch(/[a-z]/);
    });

    it("should contain at least one number", () => {
      const password = generateRandomPassword();
      expect(password).toMatch(/[0-9]/);
    });

    it("should contain at least one special character", () => {
      const password = generateRandomPassword();
      expect(password).toMatch(/[!@#$%^&*]/);
    });

    it("should generate unique passwords", () => {
      const passwords = new Set();
      for (let i = 0; i < 100; i++) {
        passwords.add(generateRandomPassword());
      }
      expect(passwords.size).toBe(100);
    });

    it("should pass password strength validation", () => {
      const password = generateRandomPassword();
      const result = validatePasswordStrength(password);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should accept valid strong password", () => {
      const result = validatePasswordStrength("StrongPass123!");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject password shorter than 8 characters", () => {
      const result = validatePasswordStrength("Pass1!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long"
      );
    });

    it("should reject password without uppercase", () => {
      const result = validatePasswordStrength("password123!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
    });

    it("should reject password without lowercase", () => {
      const result = validatePasswordStrength("PASSWORD123!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter"
      );
    });

    it("should reject password without numbers", () => {
      const result = validatePasswordStrength("PasswordOnly!");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
    });

    it("should return multiple errors for weak password", () => {
      const result = validatePasswordStrength("pass");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long"
      );
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
    });

    it("should accept password with exactly 8 characters", () => {
      const result = validatePasswordStrength("Pass123!");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should accept password without special characters", () => {
      const result = validatePasswordStrength("Password123");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should handle empty password", () => {
      const result = validatePasswordStrength("");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("getTokenExpiration", () => {
    it("should return expiration date 1 hour in the future", () => {
      const before = new Date();
      const expiration = getTokenExpiration(1);
      const after = new Date();
      after.setHours(after.getHours() + 1);

      expect(expiration.getTime()).toBeGreaterThan(before.getTime());
      expect(expiration.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should return expiration date 24 hours in the future", () => {
      const before = new Date();
      const expiration = getTokenExpiration(24);
      const after = new Date();
      after.setHours(after.getHours() + 24);

      expect(expiration.getTime()).toBeGreaterThan(before.getTime());
      expect(expiration.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it("should handle fractional hours", () => {
      const before = new Date();
      const expiration = getTokenExpiration(0.5); // 30 minutes
      const after = new Date();
      after.setMinutes(after.getMinutes() + 30);

      expect(expiration.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(expiration.getTime()).toBeLessThanOrEqual(after.getTime() + 2000); // +2s tolerance
    });

    it("should handle negative hours (past date)", () => {
      const expiration = getTokenExpiration(-1);
      const now = new Date();

      expect(expiration.getTime()).toBeLessThan(now.getTime());
    });

    it("should handle zero hours", () => {
      const before = new Date();
      const expiration = getTokenExpiration(0);
      const after = new Date();

      expect(expiration.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(expiration.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe("isTokenExpired", () => {
    it("should return false for future expiration", () => {
      const future = new Date();
      future.setHours(future.getHours() + 1);

      expect(isTokenExpired(future)).toBe(false);
    });

    it("should return true for past expiration", () => {
      const past = new Date();
      past.setHours(past.getHours() - 1);

      expect(isTokenExpired(past)).toBe(true);
    });

    it("should return true for null expiration", () => {
      expect(isTokenExpired(null)).toBe(true);
    });

    it("should return true for current time (edge case)", () => {
      const now = new Date();
      // Due to timing, this might be false if executed instantly
      // So we test a microsecond in the past
      now.setMilliseconds(now.getMilliseconds() - 1);

      expect(isTokenExpired(now)).toBe(true);
    });

    it("should handle date string conversion", () => {
      const future = new Date();
      future.setHours(future.getHours() + 1);

      // Test that it works with Date objects created from strings
      expect(isTokenExpired(new Date(future.toISOString()))).toBe(false);
    });

    it("should correctly identify expiration at exact boundary", () => {
      const almostExpired = new Date();
      almostExpired.setSeconds(almostExpired.getSeconds() + 1);

      expect(isTokenExpired(almostExpired)).toBe(false);

      // Wait a bit then check
      setTimeout(() => {
        expect(isTokenExpired(almostExpired)).toBe(true);
      }, 1500);
    });
  });

  describe("Integration: Full password workflow", () => {
    it("should hash, verify, and validate password correctly", async () => {
      // Generate random password
      const password = generateRandomPassword();

      // Validate it's strong
      const validation = validatePasswordStrength(password);
      expect(validation.valid).toBe(true);

      // Hash the password
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();

      // Verify the correct password
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);

      // Reject wrong password
      const isInvalid = await verifyPassword("WrongPassword123!", hash);
      expect(isInvalid).toBe(false);
    });

    it("should create and validate token expiration", () => {
      const token = generateSecureToken();
      const expiration = getTokenExpiration(1);

      expect(token).toHaveLength(32);
      expect(isTokenExpired(expiration)).toBe(false);

      // Test with past expiration
      const pastExpiration = getTokenExpiration(-1);
      expect(isTokenExpired(pastExpiration)).toBe(true);
    });
  });
});
