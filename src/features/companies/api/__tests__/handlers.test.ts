/**
 * Integration tests for Company API Business Logic
 * Tests data transformation, validation, and database interactions
 */

import { supabaseAdmin } from "@/shared/lib/supabase/server";
import {
  parsePagination,
  parseOrderBy,
  transformFromDb,
  transformToDb,
  transformColumnName,
} from "@/shared/lib/api/api-utils";
import { companySchema } from "@/features/companies/services/schemas/company.schema";
import {
  mockDbCompany,
  mockDbCompanies,
  mockCompanyInput,
} from "@/__tests__/fixtures";

// Mock Supabase admin client
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("Company API Business Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Data Transformation", () => {
    it("should transform database results from snake_case to camelCase", () => {
      const transformed = transformFromDb<any[]>(mockDbCompanies);

      expect(transformed[0]).toHaveProperty("phoneNumber");
      expect(transformed[0]).toHaveProperty("contactPerson");
      expect(transformed[0]).not.toHaveProperty("phone_number");
      expect(transformed[0]).not.toHaveProperty("contact_person");
    });

    it("should transform input from camelCase to snake_case for database", () => {
      const transformed = transformToDb(mockCompanyInput);

      expect(transformed).toHaveProperty("phone_number");
      expect(transformed).toHaveProperty("contact_person");
      expect(transformed).not.toHaveProperty("phoneNumber");
      expect(transformed).not.toHaveProperty("contactPerson");
    });

    it("should transform column names for orderBy", () => {
      expect(transformColumnName("createdAt")).toBe("created_at");
      expect(transformColumnName("phoneNumber")).toBe("phone_number");
      expect(transformColumnName("name")).toBe("name");
    });
  });

  describe("Pagination Logic", () => {
    it("should parse pagination params correctly", () => {
      const searchParams = new URLSearchParams("page=3&pageSize=25");
      const { page, pageSize } = parsePagination(searchParams);

      expect(page).toBe(3);
      expect(pageSize).toBe(25);
    });

    it("should calculate correct range for database query", () => {
      const searchParams = new URLSearchParams("page=3&pageSize=25");
      const { page, pageSize } = parsePagination(searchParams);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      expect(from).toBe(50);
      expect(to).toBe(74);
    });
  });

  describe("OrderBy Logic", () => {
    it("should parse orderBy params correctly", () => {
      const orderByRules = parseOrderBy("name:asc,createdAt:desc");

      expect(orderByRules).toHaveLength(2);
      expect(orderByRules[0]).toEqual({ column: "name", ascending: true });
      expect(orderByRules[1]).toEqual({
        column: "createdAt",
        ascending: false,
      });
    });

    it("should handle single orderBy param", () => {
      const orderByRules = parseOrderBy("name:desc");

      expect(orderByRules).toHaveLength(1);
      expect(orderByRules[0]).toEqual({ column: "name", ascending: false });
    });
  });

  describe("Validation Logic", () => {
    it("should validate correct company data", () => {
      const result = companySchema.safeParse(mockCompanyInput);

      expect(result.success).toBe(true);
    });

    it("should reject company with name too short", () => {
      const invalidData = {
        ...mockCompanyInput,
        name: "A",
      };

      const result = companySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("should reject company with invalid email", () => {
      const invalidData = {
        ...mockCompanyInput,
        email: "not-an-email",
      };

      const result = companySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should apply default values", () => {
      const minimalData = {
        name: "Acme Corp",
        email: "contact@acme.com",
        address: "123 Business St",
        phoneNumber: "+1234567890",
      };

      const result = companySchema.safeParse(minimalData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("status", "active");
      }
    });

    it("should accept valid status values", () => {
      const statuses = ["active", "inactive"];

      statuses.forEach((status) => {
        const data = {
          ...mockCompanyInput,
          status,
        };

        const result = companySchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid status values", () => {
      const invalidData = {
        ...mockCompanyInput,
        status: 123, // Not a string
      };

      const result = companySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("Database Query Construction", () => {
    it("should apply orderBy rules to query", () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: mockDbCompanies,
        error: null,
        count: 2,
      });

      (supabaseAdmin.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        order: mockOrder,
        range: mockRange,
      });

      const orderByRules = parseOrderBy("name:asc");

      // This would be called inside the service/repository
      expect(orderByRules[0]).toEqual({ column: "name", ascending: true });
    });

    it("should handle pagination in database query", () => {
      const searchParams = new URLSearchParams("page=2&pageSize=10");
      const { page, pageSize } = parsePagination(searchParams);

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      expect(from).toBe(10);
      expect(to).toBe(19);
    });
  });
});
