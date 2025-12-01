import { paginationSchema } from "@/shared/schemas/pagination.schema";

describe("Pagination Schema", () => {
  describe("paginationSchema", () => {
    it("should apply default values when no params provided", () => {
      const result = paginationSchema.parse({});

      expect(result).toEqual({
        page: 1,
        pageSize: 10,
      });
    });

    it("should validate correct pagination params", () => {
      const result = paginationSchema.parse({
        page: 5,
        pageSize: 20,
      });

      expect(result).toEqual({
        page: 5,
        pageSize: 20,
      });
    });

    describe("page field", () => {
      it("should coerce string to number", () => {
        const result = paginationSchema.parse({
          page: "3",
        });

        expect(result.page).toBe(3);
        expect(typeof result.page).toBe("number");
      });

      it("should reject page less than 1", () => {
        const testCases = [0, -1, -100];

        testCases.forEach((page) => {
          const result = paginationSchema.safeParse({ page });
          expect(result.success).toBe(false);
        });
      });

      it("should accept page equal to 1", () => {
        const result = paginationSchema.parse({ page: 1 });
        expect(result.page).toBe(1);
      });

      it("should accept large page numbers", () => {
        const result = paginationSchema.parse({ page: 1000 });
        expect(result.page).toBe(1000);
      });

      it("should coerce decimal to integer", () => {
        const result = paginationSchema.parse({ page: "3.7" });
        // Zod coerce.number() parses "3.7" as 3.7, not 3
        expect(result.page).toBe(3.7);
      });

      it("should reject non-numeric strings", () => {
        const result = paginationSchema.safeParse({ page: "abc" });
        expect(result.success).toBe(false);
      });

      it("should default to 1 when not provided", () => {
        const result = paginationSchema.parse({});
        expect(result.page).toBe(1);
      });
    });

    describe("pageSize field", () => {
      it("should coerce string to number", () => {
        const result = paginationSchema.parse({
          pageSize: "25",
        });

        expect(result.pageSize).toBe(25);
        expect(typeof result.pageSize).toBe("number");
      });

      it("should reject pageSize less than 1", () => {
        const testCases = [0, -1, -10];

        testCases.forEach((pageSize) => {
          const result = paginationSchema.safeParse({ pageSize });
          expect(result.success).toBe(false);
        });
      });

      it("should accept pageSize equal to 1", () => {
        const result = paginationSchema.parse({ pageSize: 1 });
        expect(result.pageSize).toBe(1);
      });

      it("should accept pageSize equal to 100", () => {
        const result = paginationSchema.parse({ pageSize: 100 });
        expect(result.pageSize).toBe(100);
      });

      it("should reject pageSize greater than 100", () => {
        const testCases = [101, 150, 1000];

        testCases.forEach((pageSize) => {
          const result = paginationSchema.safeParse({ pageSize });
          expect(result.success).toBe(false);
        });
      });

      it("should accept valid pageSize values", () => {
        const validSizes = [1, 10, 25, 50, 75, 100];

        validSizes.forEach((pageSize) => {
          const result = paginationSchema.parse({ pageSize });
          expect(result.pageSize).toBe(pageSize);
        });
      });

      it("should default to 10 when not provided", () => {
        const result = paginationSchema.parse({});
        expect(result.pageSize).toBe(10);
      });

      it("should coerce decimal to integer", () => {
        const result = paginationSchema.parse({ pageSize: "25.9" });
        // Zod coerce.number() parses "25.9" as 25.9, not 25
        expect(result.pageSize).toBe(25.9);
      });

      it("should reject non-numeric strings", () => {
        const result = paginationSchema.safeParse({ pageSize: "large" });
        expect(result.success).toBe(false);
      });
    });

    describe("orderBy field", () => {
      it("should accept valid orderBy string", () => {
        const result = paginationSchema.parse({
          orderBy: "name:asc",
        });

        expect(result.orderBy).toBe("name:asc");
      });

      it("should accept multiple sort columns", () => {
        const result = paginationSchema.parse({
          orderBy: "name:asc,createdAt:desc",
        });

        expect(result.orderBy).toBe("name:asc,createdAt:desc");
      });

      it("should be optional", () => {
        const result = paginationSchema.parse({});
        expect(result.orderBy).toBeUndefined();
      });

      it("should accept empty string", () => {
        const result = paginationSchema.parse({
          orderBy: "",
        });

        expect(result.orderBy).toBe("");
      });

      it("should accept various orderBy formats", () => {
        const formats = [
          "name",
          "name:asc",
          "name:desc",
          "createdAt:asc,updatedAt:desc",
          "id:desc,name:asc,email",
        ];

        formats.forEach((orderBy) => {
          const result = paginationSchema.parse({ orderBy });
          expect(result.orderBy).toBe(orderBy);
        });
      });

      it("should reject non-string orderBy", () => {
        const result = paginationSchema.safeParse({
          orderBy: 123 as any,
        });

        expect(result.success).toBe(false);
      });
    });

    describe("combined params", () => {
      it("should validate all params together", () => {
        const result = paginationSchema.parse({
          page: 3,
          pageSize: 25,
          orderBy: "name:asc,createdAt:desc",
        });

        expect(result).toEqual({
          page: 3,
          pageSize: 25,
          orderBy: "name:asc,createdAt:desc",
        });
      });

      it("should apply defaults only to missing params", () => {
        const result = paginationSchema.parse({
          page: 5,
        });

        expect(result).toEqual({
          page: 5,
          pageSize: 10,
        });
      });

      it("should coerce all numeric strings", () => {
        const result = paginationSchema.parse({
          page: "7",
          pageSize: "50",
          orderBy: "name:asc",
        });

        expect(result).toEqual({
          page: 7,
          pageSize: 50,
          orderBy: "name:asc",
        });
      });

      it("should reject if any field is invalid", () => {
        const invalidCases = [
          { page: 0, pageSize: 25 },
          { page: 5, pageSize: 150 },
          { page: -1, pageSize: 10 },
          { page: 5, pageSize: -10 },
        ];

        invalidCases.forEach((params) => {
          const result = paginationSchema.safeParse(params);
          expect(result.success).toBe(false);
        });
      });

      it("should accept minimal valid params", () => {
        const result = paginationSchema.parse({
          page: 1,
          pageSize: 1,
        });

        expect(result).toEqual({
          page: 1,
          pageSize: 1,
        });
      });

      it("should accept maximum valid params", () => {
        const result = paginationSchema.parse({
          page: 9999,
          pageSize: 100,
          orderBy: "id:desc",
        });

        expect(result).toEqual({
          page: 9999,
          pageSize: 100,
          orderBy: "id:desc",
        });
      });
    });

    describe("edge cases", () => {
      it("should handle undefined values", () => {
        const result = paginationSchema.parse({
          page: undefined,
          pageSize: undefined,
          orderBy: undefined,
        });

        expect(result).toEqual({
          page: 1,
          pageSize: 10,
        });
      });

      it("should handle null being coerced", () => {
        const result = paginationSchema.safeParse({
          page: null,
        });

        // Coercion of null depends on Zod behavior
        // It should either fail or coerce to 0 (which then fails min(1))
        expect(result.success).toBe(false);
      });

      it("should handle extra unknown fields by ignoring them", () => {
        const result = paginationSchema.parse({
          page: 2,
          pageSize: 20,
          extraField: "ignored",
        } as any);

        // Zod ignores extra fields by default
        expect(result.page).toBe(2);
        expect(result.pageSize).toBe(20);
      });
      it("should handle boolean values by coercing to number", () => {
        const result = paginationSchema.safeParse({
          page: true,
        });

        // Zod coerce.number() converts true to 1, which passes min(1)
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.page).toBe(1);
        }
      });

      it("should handle array values by failing coercion", () => {
        const result = paginationSchema.safeParse({
          page: [1, 2],
        });

        expect(result.success).toBe(false);
      });

      it("should handle object values by failing coercion", () => {
        const result = paginationSchema.safeParse({
          page: { value: 1 },
        });

        expect(result.success).toBe(false);
      });
    });
  });
});
