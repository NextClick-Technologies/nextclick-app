/**
 * Mock Supabase client for testing
 * Provides chainable methods that match the real Supabase client API
 */

export interface MockSupabaseResponse<T = any> {
  data: T | null;
  error: Error | null;
  count?: number | null;
  status?: number;
  statusText?: string;
}

export class MockSupabaseQueryBuilder {
  private mockData: any = null;
  private mockError: Error | null = null;
  private mockCount: number | null = null;

  constructor(data?: any, error?: Error | null, count?: number | null) {
    this.mockData = data;
    this.mockError = error ?? null;
    this.mockCount = count ?? null;
  }

  select(columns?: string) {
    return this;
  }

  insert(data: any) {
    return this;
  }

  update(data: any) {
    return this;
  }

  delete() {
    return this;
  }

  eq(column: string, value: any) {
    return this;
  }

  neq(column: string, value: any) {
    return this;
  }

  gt(column: string, value: any) {
    return this;
  }

  gte(column: string, value: any) {
    return this;
  }

  lt(column: string, value: any) {
    return this;
  }

  lte(column: string, value: any) {
    return this;
  }

  like(column: string, pattern: string) {
    return this;
  }

  ilike(column: string, pattern: string) {
    return this;
  }

  in(column: string, values: any[]) {
    return this;
  }

  contains(column: string, value: any) {
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    return this;
  }

  limit(count: number) {
    return this;
  }

  range(from: number, to: number) {
    return this;
  }

  single() {
    return this;
  }

  maybeSingle() {
    return this;
  }

  async then(
    onfulfilled?: (value: MockSupabaseResponse) => any,
    onrejected?: (reason: any) => any
  ) {
    const response: MockSupabaseResponse = {
      data: this.mockData,
      error: this.mockError,
      count: this.mockCount,
      status: this.mockError ? 400 : 200,
      statusText: this.mockError ? "Bad Request" : "OK",
    };

    if (onfulfilled) {
      return onfulfilled(response);
    }
    return response;
  }

  // Allow setting mock data/error for specific test scenarios
  setMockData(data: any) {
    this.mockData = data;
    return this;
  }

  setMockError(error: Error | null) {
    this.mockError = error;
    return this;
  }

  setMockCount(count: number | null) {
    this.mockCount = count;
    return this;
  }
}

export class MockSupabaseClient {
  private mockData: any = null;
  private mockError: Error | null = null;
  private mockCount: number | null = null;

  from(table: string) {
    return new MockSupabaseQueryBuilder(
      this.mockData,
      this.mockError,
      this.mockCount
    );
  }

  // Helper methods to configure mock responses
  setMockData(data: any) {
    this.mockData = data;
    return this;
  }

  setMockError(error: Error | null) {
    this.mockError = error;
    return this;
  }

  setMockCount(count: number | null) {
    this.mockCount = count;
    return this;
  }

  reset() {
    this.mockData = null;
    this.mockError = null;
    this.mockCount = null;
    return this;
  }
}

/**
 * Create a new mock Supabase client instance
 */
export function createMockSupabaseClient() {
  return new MockSupabaseClient();
}

/**
 * Mock Supabase admin client for API route testing
 */
export const mockSupabaseAdmin = createMockSupabaseClient();

/**
 * Helper to mock successful responses
 */
export function mockSupabaseSuccess<T>(data: T, count?: number) {
  return {
    data,
    error: null,
    count: count ?? null,
    status: 200,
    statusText: "OK",
  };
}

/**
 * Helper to mock error responses
 */
export function mockSupabaseError(message: string, code?: string) {
  const error = new Error(message) as any;
  if (code) error.code = code;

  return {
    data: null,
    error,
    count: null,
    status: 400,
    statusText: "Bad Request",
  };
}
