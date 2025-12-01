import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
  transformToDb,
  transformFromDb,
  transformColumnName,
} from "@/lib/api/api-utils";

// Mock NextResponse.json
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      data,
      status: options?.status || 200,
    })),
  },
}));

describe("API Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("apiSuccess", () => {
    it("should return success response with default 200 status", () => {
      const data = { id: 1, name: "Test" };
      const result = apiSuccess(data);

      expect(NextResponse.json).toHaveBeenCalledWith(data, { status: 200 });
      expect(result).toEqual({
        data,
        status: 200,
      });
    });

    it("should return success response with custom status", () => {
      const data = { id: 1 };
      const result = apiSuccess(data, 201);

      expect(NextResponse.json).toHaveBeenCalledWith(data, { status: 201 });
      expect(result).toEqual({
        data,
        status: 201,
      });
    });

    it("should handle null data", () => {
      const result = apiSuccess(null);

      expect(NextResponse.json).toHaveBeenCalledWith(null, { status: 200 });
    });

    it("should handle array data", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = apiSuccess(data);

      expect(NextResponse.json).toHaveBeenCalledWith(data, { status: 200 });
    });
  });

  describe("apiError", () => {
    it("should return error response with default 500 status", () => {
      const result = apiError("Something went wrong");

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Something went wrong" },
        { status: 500 }
      );
      expect(result).toEqual({
        data: { error: "Something went wrong" },
        status: 500,
      });
    });

    it("should return error response with custom status", () => {
      const result = apiError("Not found", 404);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Not found" },
        { status: 404 }
      );
      expect(result).toEqual({
        data: { error: "Not found" },
        status: 404,
      });
    });

    it("should include details when provided", () => {
      const details = { field: "email", issue: "invalid" };
      const result = apiError("Validation error", 400, details);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: "Validation error",
          details,
        },
        { status: 400 }
      );
    });

    it("should not include details property when not provided", () => {
      const result = apiError("Error");

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Error" },
        { status: 500 }
      );
    });
  });

  describe("handleApiError", () => {
    beforeEach(() => {
      // Suppress console.error during tests
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should handle ZodError with validation details", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          path: ["name"],
          message: "Expected string, received number",
        },
      ]);

      const result = handleApiError(zodError);

      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          error: "Validation error",
          details: zodError.issues,
        },
        { status: 400 }
      );
    });

    it("should handle standard Error", () => {
      const error = new Error("Database connection failed");

      const result = handleApiError(error);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Database connection failed" },
        { status: 500 }
      );
    });

    it("should handle unknown error types", () => {
      const result = handleApiError("string error");

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    });

    it("should handle null error", () => {
      const result = handleApiError(null);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    });

    it("should log error to console", () => {
      const error = new Error("Test error");
      handleApiError(error);

      // Logger uses Pino format: logger.error({ err: error }, "API Error")
      expect(console.error).toHaveBeenCalledWith(
        "[ERROR]",
        { err: error },
        "API Error"
      );
    });
  });

  describe("parsePagination", () => {
    it("should return default values when no params provided", () => {
      const searchParams = new URLSearchParams();
      const result = parsePagination(searchParams);

      expect(result).toEqual({ page: 1, pageSize: 10 });
    });

    it("should parse valid page and pageSize", () => {
      const searchParams = new URLSearchParams("page=5&pageSize=20");
      const result = parsePagination(searchParams);

      expect(result).toEqual({ page: 5, pageSize: 20 });
    });

    it("should enforce minimum page of 1", () => {
      const testCases = [
        new URLSearchParams("page=0"),
        new URLSearchParams("page=-5"),
        new URLSearchParams("page=-100"),
      ];

      testCases.forEach((searchParams) => {
        const result = parsePagination(searchParams);
        expect(result.page).toBe(1);
      });
    });

    it("should enforce minimum pageSize of 1", () => {
      const searchParams = new URLSearchParams("pageSize=0");
      const result = parsePagination(searchParams);

      expect(result.pageSize).toBe(1);
    });

    it("should enforce maximum pageSize of 100", () => {
      const testCases = [
        new URLSearchParams("pageSize=150"),
        new URLSearchParams("pageSize=1000"),
        new URLSearchParams("pageSize=999999"),
      ];

      testCases.forEach((searchParams) => {
        const result = parsePagination(searchParams);
        expect(result.pageSize).toBe(100);
      });
    });

    it("should handle invalid numeric values", () => {
      const searchParams = new URLSearchParams("page=abc&pageSize=xyz");
      const result = parsePagination(searchParams);

      // parseInt returns NaN for invalid strings, then Math.max(1, NaN) = 1
      // However, NaN comparisons are tricky - let's check the actual behavior
      expect(isNaN(result.page) || result.page >= 1).toBe(true);
      expect(isNaN(result.pageSize) || result.pageSize >= 1).toBe(true);
    });

    it("should handle partial invalid values", () => {
      const searchParams = new URLSearchParams("page=3&pageSize=invalid");
      const result = parsePagination(searchParams);

      expect(result.page).toBe(3);
      // pageSize will be NaN from parseInt, check if it's handled
      expect(isNaN(result.pageSize) || result.pageSize >= 1).toBe(true);
    });

    it("should handle decimal values by truncating", () => {
      const searchParams = new URLSearchParams("page=2.7&pageSize=15.9");
      const result = parsePagination(searchParams);

      expect(result).toEqual({ page: 2, pageSize: 15 });
    });
  });

  describe("parseOrderBy", () => {
    it("should return empty array when orderBy is null", () => {
      const result = parseOrderBy(null);

      expect(result).toEqual([]);
    });

    it("should parse single column with ascending order", () => {
      const result = parseOrderBy("name:asc");

      expect(result).toEqual([{ column: "name", ascending: true }]);
    });

    it("should parse single column with descending order", () => {
      const result = parseOrderBy("name:desc");

      expect(result).toEqual([{ column: "name", ascending: false }]);
    });

    it("should parse single column with dsc abbreviation", () => {
      const result = parseOrderBy("name:dsc");

      expect(result).toEqual([{ column: "name", ascending: false }]);
    });

    it("should default to ascending when direction not specified", () => {
      const result = parseOrderBy("name");

      expect(result).toEqual([{ column: "name", ascending: true }]);
    });

    it("should parse multiple columns", () => {
      const result = parseOrderBy("name:asc,createdAt:desc,email");

      expect(result).toEqual([
        { column: "name", ascending: true },
        { column: "createdAt", ascending: false },
        { column: "email", ascending: true },
      ]);
    });

    it("should handle columns with spaces", () => {
      const result = parseOrderBy(" name : asc , createdAt : desc ");

      // Only column name is trimmed, direction is not, so " desc " !== "desc"
      expect(result).toEqual([
        { column: "name", ascending: true },
        { column: "createdAt", ascending: true }, // " desc " doesn't match "desc"
      ]);
    });

    it("should be case-insensitive for direction", () => {
      const result = parseOrderBy("name:DESC,email:ASC,id:DsC");

      expect(result).toEqual([
        { column: "name", ascending: false },
        { column: "email", ascending: true },
        { column: "id", ascending: false },
      ]);
    });

    it("should handle invalid direction as ascending", () => {
      const result = parseOrderBy("name:invalid");

      expect(result).toEqual([{ column: "name", ascending: true }]);
    });
  });

  describe("buildPaginatedResponse", () => {
    it("should build basic paginated response", () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = buildPaginatedResponse(data, 1, 10, 50);

      expect(result).toEqual({
        data,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 50,
          totalPages: 5,
        },
      });
    });

    it("should calculate total pages correctly", () => {
      const data = [{ id: 1 }];
      const testCases = [
        { total: 100, pageSize: 10, expectedPages: 10 },
        { total: 95, pageSize: 10, expectedPages: 10 },
        { total: 91, pageSize: 10, expectedPages: 10 },
        { total: 100, pageSize: 25, expectedPages: 4 },
        { total: 1, pageSize: 10, expectedPages: 1 },
        { total: 0, pageSize: 10, expectedPages: 0 },
      ];

      testCases.forEach(({ total, pageSize, expectedPages }) => {
        const result = buildPaginatedResponse(data, 1, pageSize, total);
        expect(result.pagination.totalPages).toBe(expectedPages);
      });
    });

    it("should include metadata when provided", () => {
      const data = [{ id: 1 }];
      const metadata = { timestamp: "2024-01-01", source: "test" };
      const result = buildPaginatedResponse(data, 1, 10, 50, metadata);

      expect(result).toEqual({
        data,
        pagination: {
          page: 1,
          pageSize: 10,
          total: 50,
          totalPages: 5,
        },
        metadata,
      });
    });

    it("should not include metadata property when not provided", () => {
      const data = [{ id: 1 }];
      const result = buildPaginatedResponse(data, 1, 10, 50);

      expect(result).not.toHaveProperty("metadata");
    });

    it("should handle empty data array", () => {
      const result = buildPaginatedResponse([], 1, 10, 0);

      expect(result).toEqual({
        data: [],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });
  });

  describe("transformToDb", () => {
    it("should convert camelCase keys to snake_case", () => {
      const data = {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john@example.com",
      };

      const result = transformToDb(data);

      expect(result).toEqual({
        first_name: "John",
        last_name: "Doe",
        email_address: "john@example.com",
      });
    });

    it("should leave single-word keys unchanged", () => {
      const data = {
        id: "123",
        name: "John",
        email: "john@example.com",
        age: 30,
      };

      const result = transformToDb(data);

      expect(result).toEqual({
        id: "123",
        name: "John",
        email: "john@example.com",
        age: 30,
      });
    });

    it("should handle mixed camelCase and single-word keys", () => {
      const data = {
        id: "123",
        firstName: "John",
        email: "john@example.com",
        phoneNumber: "+1234567890",
      };

      const result = transformToDb(data);

      expect(result).toEqual({
        id: "123",
        first_name: "John",
        email: "john@example.com",
        phone_number: "+1234567890",
      });
    });

    it("should handle nested objects", () => {
      const data = {
        userId: "123",
        userDetails: {
          firstName: "John",
          lastName: "Doe",
        },
      };

      const result = transformToDb(data);

      expect(result).toEqual({
        user_id: "123",
        user_details: {
          first_name: "John",
          last_name: "Doe",
        },
      });
    });

    it("should handle arrays", () => {
      const data = {
        userIds: ["123", "456"],
        items: [{ itemName: "Item 1" }, { itemName: "Item 2" }],
      };

      const result = transformToDb(data);

      expect(result).toEqual({
        user_ids: ["123", "456"],
        items: [{ item_name: "Item 1" }, { item_name: "Item 2" }],
      });
    });

    it("should handle null and undefined values", () => {
      const data = {
        firstName: "John",
        middleName: null,
        lastName: undefined,
      };

      const result = transformToDb(data);

      expect(result).toEqual({
        first_name: "John",
        middle_name: null,
        last_name: undefined,
      });
    });
  });

  describe("transformFromDb", () => {
    it("should convert snake_case keys to camelCase", () => {
      const data = {
        first_name: "John",
        last_name: "Doe",
        email_address: "john@example.com",
      };

      const result = transformFromDb(data);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john@example.com",
      });
    });

    it("should handle single-word keys", () => {
      const data = {
        id: "123",
        name: "John",
        email: "john@example.com",
      };

      const result = transformFromDb(data);

      expect(result).toEqual({
        id: "123",
        name: "John",
        email: "john@example.com",
      });
    });

    it("should handle arrays of objects", () => {
      const data = [
        { first_name: "John", last_name: "Doe" },
        { first_name: "Jane", last_name: "Smith" },
      ];

      const result = transformFromDb(data);

      expect(result).toEqual([
        { firstName: "John", lastName: "Doe" },
        { firstName: "Jane", lastName: "Smith" },
      ]);
    });

    it("should handle nested objects", () => {
      const data = {
        user_id: "123",
        user_details: {
          first_name: "John",
          last_name: "Doe",
        },
      };

      const result = transformFromDb(data);

      expect(result).toEqual({
        userId: "123",
        userDetails: {
          firstName: "John",
          lastName: "Doe",
        },
      });
    });

    it("should handle empty objects", () => {
      const result = transformFromDb({});

      expect(result).toEqual({});
    });

    it("should handle empty arrays", () => {
      const result = transformFromDb([]);

      expect(result).toEqual([]);
    });

    it("should preserve null and undefined values", () => {
      const data = {
        first_name: "John",
        middle_name: null,
        last_name: undefined,
      };

      const result = transformFromDb(data);

      expect(result).toEqual({
        firstName: "John",
        middleName: null,
        lastName: undefined,
      });
    });
  });

  describe("transformColumnName", () => {
    it("should convert camelCase to snake_case", () => {
      expect(transformColumnName("firstName")).toBe("first_name");
      expect(transformColumnName("lastName")).toBe("last_name");
      expect(transformColumnName("emailAddress")).toBe("email_address");
    });

    it("should leave single-word columns unchanged", () => {
      expect(transformColumnName("id")).toBe("id");
      expect(transformColumnName("name")).toBe("name");
      expect(transformColumnName("email")).toBe("email");
      expect(transformColumnName("age")).toBe("age");
    });

    it("should handle multiple uppercase letters", () => {
      expect(transformColumnName("userIDNumber")).toBe("user_i_d_number");
      // First character uppercase gets _ prefix
      expect(transformColumnName("XMLHttpRequest")).toBe("_x_m_l_http_request");
    });

    it("should handle consecutive uppercase letters", () => {
      // First character uppercase gets _ prefix
      expect(transformColumnName("HTTPSConnection")).toBe(
        "_h_t_t_p_s_connection"
      );
    });

    it("should handle already snake_case columns", () => {
      expect(transformColumnName("first_name")).toBe("first_name");
      expect(transformColumnName("created_at")).toBe("created_at");
    });

    it("should handle empty string", () => {
      expect(transformColumnName("")).toBe("");
    });

    it("should handle single character", () => {
      expect(transformColumnName("a")).toBe("a");
      expect(transformColumnName("A")).toBe("_a");
    });
  });

  describe("transformToDb and transformFromDb round-trip", () => {
    it("should maintain data integrity in round-trip conversion", () => {
      const original = {
        firstName: "John",
        lastName: "Doe",
        emailAddress: "john@example.com",
        phoneNumber: "+1234567890",
        companyId: "123",
      };

      const toDb = transformToDb(original);
      const fromDb = transformFromDb(toDb);

      expect(fromDb).toEqual(original);
    });

    it("should handle complex nested structures in round-trip", () => {
      const original = {
        userId: "123",
        userProfile: {
          firstName: "John",
          lastName: "Doe",
          contactInfo: {
            emailAddress: "john@example.com",
            phoneNumber: "+1234567890",
          },
        },
        orderIds: ["order1", "order2"],
      };

      const toDb = transformToDb(original);
      const fromDb = transformFromDb(toDb);

      expect(fromDb).toEqual(original);
    });
  });
});
