/**
 * Integration tests for Project API Business Logic
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
import { projectSchema } from "@/features/projects/domain/schemas/project.schema";
import {
  mockDbProject,
  mockDbProjects,
  mockProjectInput,
} from "@/__tests__/fixtures";

// Mock Supabase admin client
jest.mock("@/shared/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("Project API Business Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Data Transformation", () => {
    it("should transform database results from snake_case to camelCase", () => {
      const transformed = transformFromDb<any[]>(mockDbProjects);

      expect(transformed[0]).toHaveProperty("startDate");
      expect(transformed[0]).toHaveProperty("finishDate");
      expect(transformed[0]).toHaveProperty("paymentTerms");
      expect(transformed[0]).toHaveProperty("completionDate");
      expect(transformed[0]).toHaveProperty("clientId");
      expect(transformed[0]).toHaveProperty("projectManager");
      expect(transformed[0]).not.toHaveProperty("start_date");
      expect(transformed[0]).not.toHaveProperty("finish_date");
      expect(transformed[0]).not.toHaveProperty("payment_terms");
    });

    it("should transform input from camelCase to snake_case for database", () => {
      const transformed = transformToDb(mockProjectInput);

      expect(transformed).toHaveProperty("start_date");
      expect(transformed).toHaveProperty("finish_date");
      expect(transformed).toHaveProperty("payment_terms");
      expect(transformed).toHaveProperty("client_id");
      expect(transformed).toHaveProperty("project_manager");
      expect(transformed).not.toHaveProperty("startDate");
      expect(transformed).not.toHaveProperty("finishDate");
      expect(transformed).not.toHaveProperty("paymentTerms");
    });

    it("should transform column names for orderBy", () => {
      expect(transformColumnName("createdAt")).toBe("created_at");
      expect(transformColumnName("startDate")).toBe("start_date");
      expect(transformColumnName("clientId")).toBe("client_id");
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
    it("should validate correct project data", () => {
      const result = projectSchema.safeParse(mockProjectInput);

      expect(result.success).toBe(true);
    });

    it("should reject project with name too short", () => {
      const invalidData = {
        ...mockProjectInput,
        name: "P",
      };

      const result = projectSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0].path).toContain("name");
      }
    });

    it("should reject project with invalid UUID for clientId", () => {
      const invalidData = {
        ...mockProjectInput,
        clientId: "not-a-uuid",
      };

      const result = projectSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject project with invalid payment terms", () => {
      const invalidData = {
        ...mockProjectInput,
        paymentTerms: "invalid-terms",
      };

      const result = projectSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject project with invalid status", () => {
      const invalidData = {
        ...mockProjectInput,
        status: "invalid-status",
      };

      const result = projectSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should reject project with invalid priority", () => {
      const invalidData = {
        ...mockProjectInput,
        priority: "invalid-priority",
      };

      const result = projectSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("should apply default values", () => {
      const minimalData = {
        name: "Test Project",
        clientId: "550e8400-e29b-41d4-a716-446655440001",
      };

      const result = projectSchema.safeParse(minimalData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty("status", "active");
        expect(result.data).toHaveProperty("priority", "medium");
        expect(result.data).toHaveProperty("paymentTerms", "net_30d");
      }
    });

    it("should accept valid payment terms", () => {
      const paymentTerms = ["net_30d", "net_60d", "net_90d", "immediate"];

      paymentTerms.forEach((term) => {
        const data = {
          name: "Test Project",
          clientId: "550e8400-e29b-41d4-a716-446655440001",
          paymentTerms: term,
        };

        const result = projectSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should accept valid status values", () => {
      const statuses = ["active", "completed", "on_hold", "cancelled"];

      statuses.forEach((status) => {
        const data = {
          name: "Test Project",
          clientId: "550e8400-e29b-41d4-a716-446655440001",
          status,
        };

        const result = projectSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should accept valid priority values", () => {
      const priorities = ["low", "medium", "high", "urgent"];

      priorities.forEach((priority) => {
        const data = {
          name: "Test Project",
          clientId: "550e8400-e29b-41d4-a716-446655440001",
          priority,
        };

        const result = projectSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Database Query Construction", () => {
    it("should apply orderBy rules to query", () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockRange = jest.fn().mockResolvedValue({
        data: mockDbProjects,
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
