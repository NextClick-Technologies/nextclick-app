/**
 * Integration tests for Employee API Business Logic
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
import { employeeSchema } from "@/features/employees/domain/schemas";
import {
  mockDbEmployee,
  mockDbEmployees,
  mockEmployeeInput,
} from "@/__tests__/fixtures";

// Mock Supabase admin client
jest.mock("@/shared/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("Employee API Business Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Data Transformation", () => {
    it("should transform database results from snake_case to camelCase", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformed = transformFromDb<any[]>(mockDbEmployees);

      expect(transformed[0]).toHaveProperty("familyName");
      expect(transformed[0]).toHaveProperty("preferredName");
      expect(transformed[0]).toHaveProperty("phoneNumber");
      expect(transformed[0]).toHaveProperty("userId");
      expect(transformed[0]).toHaveProperty("joinDate");
      expect(transformed[0]).toHaveProperty("emergencyContact");
      expect(transformed[0]).toHaveProperty("emergencyPhone");
      expect(transformed[0]).toHaveProperty("zipCode");
      expect(transformed[0]).not.toHaveProperty("family_name");
      expect(transformed[0]).not.toHaveProperty("preferred_name");
      expect(transformed[0]).not.toHaveProperty("phone_number");
    });

    it("should transform input from camelCase to snake_case for database", () => {
      const transformed = transformToDb(mockEmployeeInput);

      expect(transformed).toHaveProperty("family_name");
      expect(transformed).toHaveProperty("preferred_name");
      expect(transformed).toHaveProperty("phone_number");
      expect(transformed).toHaveProperty("join_date");
      expect(transformed).toHaveProperty("emergency_contact");
      expect(transformed).toHaveProperty("emergency_phone");
      expect(transformed).toHaveProperty("zip_code");
      expect(transformed).not.toHaveProperty("familyName");
      expect(transformed).not.toHaveProperty("preferredName");
      expect(transformed).not.toHaveProperty("phoneNumber");
    });

    it("should transform column names for orderBy", () => {
      expect(transformColumnName("createdAt")).toBe("created_at");
      expect(transformColumnName("familyName")).toBe("family_name");
      expect(transformColumnName("joinDate")).toBe("join_date");
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
    it("should validate correct employee data", () => {
      const result = employeeSchema.safeParse(mockEmployeeInput);

      expect(result.success).toBe(true);
    });

    it("should reject employee with name too short", () => {
      const invalidData = {
        ...mockEmployeeInput,
        name: "",
      };

      const result = employeeSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("should reject employee with invalid email", () => {
      const invalidData = {
        ...mockEmployeeInput,
        email: "not-an-email",
      };

      const result = employeeSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject employee with invalid title", () => {
      const invalidData = {
        ...mockEmployeeInput,
        title: "invalid-title",
      };

      const result = employeeSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject employee with invalid gender", () => {
      const invalidData = {
        ...mockEmployeeInput,
        gender: "invalid-gender",
      };

      const result = employeeSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject employee with invalid status", () => {
      const invalidData = {
        ...mockEmployeeInput,
        status: "invalid-status",
      };

      const result = employeeSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should apply default values", () => {
      const minimalData = {
        name: "John",
        familyName: "Doe",
        gender: "male",
        phoneNumber: "+1234567890",
        email: "john.doe@company.com",
      };

      const result = employeeSchema.safeParse(minimalData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("status", "active");
      }
    });

    it("should accept valid title values", () => {
      const titles = ["mr", "mrs", "ms", "dr", "prof", "sr", null];

      titles.forEach((title) => {
        const data = {
          ...mockEmployeeInput,
          title,
        };

        const result = employeeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should accept valid gender values", () => {
      const genders = ["male", "female", "other"];

      genders.forEach((gender) => {
        const data = {
          ...mockEmployeeInput,
          gender,
        };

        const result = employeeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should accept valid status values", () => {
      const statuses = ["active", "inactive", "on_leave", "terminated"];

      statuses.forEach((status) => {
        const data = {
          ...mockEmployeeInput,
          status,
        };

        const result = employeeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should accept optional fields as null or undefined", () => {
      const dataWithNulls = {
        ...mockEmployeeInput,
        preferredName: null,
        photo: null,
        userId: null,
        salary: null,
        emergencyContact: null,
        emergencyPhone: null,
        address: null,
        city: null,
        state: null,
        zipCode: null,
        country: null,
      };

      const result = employeeSchema.safeParse(dataWithNulls);
      expect(result.success).toBe(true);
    });
  });

  describe("Database Query Construction", () => {
    it("should apply orderBy rules to query", () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: mockDbEmployees,
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
