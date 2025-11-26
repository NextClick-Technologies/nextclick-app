// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  metadata?: Record<string, unknown>;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  [key: string]: unknown;
}

// Generic API Functions
export async function fetchApi<T>(
  endpoint: string,
  params?: QueryParams
): Promise<PaginatedResponse<T>> {
  const url = new URL(`/api/${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to fetch data");
  }
  return response.json();
}

export async function fetchByIdApi<T>(
  endpoint: string,
  id: string
): Promise<SingleResponse<T>> {
  const response = await fetch(`/api/${endpoint}/${id}`);
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to fetch data");
  }
  return response.json();
}

export async function createApi<T, I>(
  endpoint: string,
  data: I
): Promise<SingleResponse<T>> {
  const response = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to create data");
  }
  return response.json();
}

export async function updateApi<T, U>(
  endpoint: string,
  id: string,
  data: U
): Promise<SingleResponse<T>> {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to update data");
  }
  return response.json();
}

export async function deleteApi(endpoint: string, id: string): Promise<void> {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to delete data");
  }
}
