/**
 * Central export for all test fixtures
 * Import fixtures from here in your tests
 */

export * from "./client.fixtures";
export * from "./company.fixtures";
export * from "./project.fixtures";
export * from "./employee.fixtures";

// Helper function to create paginated response
export function createPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
  total?: number
) {
  const actualTotal = total ?? data.length;
  const totalPages = Math.ceil(actualTotal / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total: actualTotal,
      totalPages,
    },
  };
}

// Helper function to create API success response
export function createApiSuccess<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}

// Helper function to create API error response
export function createApiError(error: string, errors?: any) {
  return {
    success: false,
    error,
    errors,
  };
}
