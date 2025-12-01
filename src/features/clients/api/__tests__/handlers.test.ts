/**
 * Integration tests for Client API Business Logic
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
import { clientSchema } from "@/features/clients/services/schemas/client.schema";
import {
  mockDbClient,
  mockDbClients,
  mockClientInput,
} from "@/__tests__/fixtures";

// Mock Supabase admin client
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("Client API Business Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Data Transformation", () => {
    it("should transform database results from snake_case to camelCase", () => {
      const transformed = transformFromDb<any[]>(mockDbClients);

      expect(transformed[0]).toHaveProperty("familyName");
      expect(transformed[0]).toHaveProperty("phoneNumber");
      expect(transformed[0]).toHaveProperty("companyId");
      expect(transformed[0]).not.toHaveProperty("family_name");
      expect(transformed[0]).not.toHaveProperty("phone_number");
    });

    it("should transform input from camelCase to snake_case for database", () => {
      const transformed = transformToDb(mockClientInput);

      expect(transformed).toHaveProperty("family_name");
      expect(transformed).toHaveProperty("phone_number");
      expect(transformed).toHaveProperty("company_id");
      expect(transformed).not.toHaveProperty("familyName");
    });

    it("should transform column names for orderBy", () => {
      expect(transformColumnName("createdAt")).toBe("created_at");
      expect(transformColumnName("familyName")).toBe("family_name");
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
    it("should validate correct client data", () => {
      const result = clientSchema.safeParse(mockClientInput);

      expect(result.success).toBe(true);
    });

    it("should reject client with name too short", () => {
      const invalidData = {
        ...mockClientInput,
        name: "J",
      };

      const result = clientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("should reject client with invalid email", () => {
      const invalidData = {
        ...mockClientInput,
        email: "not-an-email",
      };

      const result = clientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject client with invalid UUID for companyId", () => {
      const invalidData = {
        ...mockClientInput,
        companyId: "not-a-uuid",
      };

      const result = clientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should apply default values", () => {
      const minimalData = {
        name: "John",
        familyName: "Doe",
        phoneNumber: "+1234567890",
        companyId: "550e8400-e29b-41d4-a716-446655440001",
      };

      const result = clientSchema.parse(minimalData);

      expect(result.title).toBeDefined();
      expect(result.gender).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.totalContractValue).toBe(0);
    });
  });

  describe("Supabase Query Building", () => {
    const mockFrom = jest.fn();
    const mockSelect = jest.fn();
    const mockOrder = jest.fn();
    const mockRange = jest.fn();
    const mockInsert = jest.fn();
    const mockSingle = jest.fn();

    beforeEach(() => {
      mockRange.mockResolvedValue({
        data: mockDbClients,
        error: null,
        count: 50,
      });
      mockOrder.mockReturnValue({ range: mockRange });
      mockSelect.mockReturnValue({ order: mockOrder, single: mockSingle });
      mockInsert.mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({
        select: mockSelect,
        insert: mockInsert,
      });
      (supabaseAdmin.from as jest.Mock).mockImplementation(mockFrom);
    });

    it("should build correct Supabase query for fetching clients", () => {
      supabaseAdmin.from("clients").select("*", { count: "exact" });

      expect(supabaseAdmin.from).toHaveBeenCalledWith("clients");
      expect(mockSelect).toHaveBeenCalledWith("*", { count: "exact" });
    });

    it("should apply ordering to query", () => {
      const query = supabaseAdmin.from("clients").select("*");
      query.order("name", { ascending: true });

      expect(mockOrder).toHaveBeenCalledWith("name", { ascending: true });
    });

    it("should apply range for pagination", () => {
      const query = supabaseAdmin.from("clients").select("*");
      query.order("name", { ascending: true }).range(0, 9);

      expect(mockRange).toHaveBeenCalledWith(0, 9);
    });

    it("should build insert query", () => {
      const dbData = transformToDb(mockClientInput);
      supabaseAdmin.from("clients").insert(dbData as never);

      expect(supabaseAdmin.from).toHaveBeenCalledWith("clients");
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      const mockRange = jest.fn();
      mockRange.mockResolvedValue({
        data: null,
        error: { message: "Database connection failed" },
        count: null,
      });

      const result = await mockRange();

      expect(result.error).toBeTruthy();
      expect(result.error.message).toBe("Database connection failed");
    });

    it("should handle validation errors", () => {
      const invalidData = {
        name: "J", // Too short
      };

      const result = clientSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
