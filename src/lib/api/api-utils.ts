import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { camelizeKeys, decamelizeKeys } from "humps";

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status: number = 500,
  details?: unknown
) {
  const error: ApiError = { error: message };
  if (details) {
    error.details = details;
  }
  return NextResponse.json(error, { status });
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return apiError("Validation error", 400, error.issues);
  }

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError("An unexpected error occurred", 500);
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") || "10"))
  );

  return { page, pageSize };
}

export function parseOrderBy(orderByParam: string | null): {
  column: string;
  ascending: boolean;
}[] {
  if (!orderByParam) return [];

  return orderByParam.split(",").map((item) => {
    const [column, direction] = item.split(":");
    return {
      column: column.trim(),
      ascending:
        direction?.toLowerCase() !== "desc" &&
        direction?.toLowerCase() !== "dsc",
    };
  });
}

export function buildPaginatedResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

// ===========================
// CASE TRANSFORMATION UTILITIES
// ===========================

/**
 * Transform data from application layer (camelCase) to database layer (snake_case)
 * Used before INSERT and UPDATE operations
 */
export function transformToDb<T = unknown>(data: T): Record<string, unknown> {
  return decamelizeKeys(data as object, (key, convert) => {
    // Only convert multi-word keys to snake_case
    // Single word keys like 'id', 'name', 'email' remain unchanged
    return /[A-Z]/.test(key) ? convert(key) : key;
  }) as Record<string, unknown>;
}

/**
 * Transform data from database layer (snake_case) to application layer (camelCase)
 * Used after SELECT operations
 */
export function transformFromDb<T = unknown>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map((item) => camelizeKeys(item)) as T;
  }
  return camelizeKeys(data as object) as T;
}

/**
 * Transform a single column name from camelCase to snake_case
 * Used for filter parameters and orderBy columns
 */
export function transformColumnName(columnName: string): string {
  // Only convert if the column name contains uppercase letters (multi-word)
  if (/[A-Z]/.test(columnName)) {
    return columnName.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
  return columnName;
}
