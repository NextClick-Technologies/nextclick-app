/**
 * Mock fetch API for testing API client functions
 */

export interface MockFetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<any>;
  text: () => Promise<string>;
}

export function createMockResponse(
  data: any,
  status: number = 200,
  ok: boolean = true
): MockFetchResponse {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Error",
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
}

export function mockFetchSuccess(data: any, status: number = 200) {
  return createMockResponse(data, status, true);
}

export function mockFetchError(
  message: string,
  status: number = 400,
  errors?: any
) {
  const errorData = {
    success: false,
    error: message,
    errors,
  };
  return createMockResponse(errorData, status, false);
}

/**
 * Setup fetch mock for specific test
 */
export function setupFetchMock(response: MockFetchResponse) {
  global.fetch = jest.fn(() => Promise.resolve(response as Response));
}

/**
 * Reset fetch mock
 */
export function resetFetchMock() {
  if (global.fetch && typeof global.fetch === "function") {
    (global.fetch as jest.Mock).mockReset();
  }
}
