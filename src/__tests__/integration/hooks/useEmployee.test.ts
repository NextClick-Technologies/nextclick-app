/**
 * Integration Tests for Employee React Query Hooks
 *
 * Tests all CRUD operations using React Query hooks with fetch mocking.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  useEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/hooks/useEmployee";
import {
  mockEmployee,
  mockEmployees,
  mockEmployeeInsert,
  mockEmployeeUpdate,
} from "@/__tests__/fixtures/employee.fixtures";

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
  fetchSpy = jest.spyOn(global, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe("useEmployees - Fetch Paginated Employees", () => {
  it("should fetch employees successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockEmployees,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockEmployees.length,
          totalPages: 1,
        },
      }),
    } as Response);

    const { result } = renderHook(() => useEmployees(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockEmployees);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch employees" }),
    } as Response);

    const { result } = renderHook(() => useEmployees(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("useEmployee - Fetch Single Employee", () => {
  it("should fetch employee by id successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockEmployee }),
    } as Response);

    const { result } = renderHook(() => useEmployee(mockEmployee.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ data: mockEmployee });
  });

  it("should not fetch when id is null", async () => {
    const { result } = renderHook(() => useEmployee(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateEmployee - Create Employee Mutation", () => {
  it("should create employee successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        data: { ...mockEmployee, ...mockEmployeeInsert },
      }),
    } as Response);

    const { result } = renderHook(() => useCreateEmployee(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockEmployeeInsert);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("should handle create error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Validation failed" }),
    } as Response);

    const { result } = renderHook(() => useCreateEmployee(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockEmployeeInsert);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("useUpdateEmployee - Update Employee Mutation", () => {
  it("should update employee successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { ...mockEmployee, ...mockEmployeeUpdate },
      }),
    } as Response);

    const { result } = renderHook(() => useUpdateEmployee(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: mockEmployee.id, data: mockEmployeeUpdate });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("should handle update error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Employee not found" }),
    } as Response);

    const { result } = renderHook(() => useUpdateEmployee(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "non-existent-id", data: mockEmployeeUpdate });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("useDeleteEmployee - Delete Employee Mutation", () => {
  it("should delete employee successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    const { result } = renderHook(() => useDeleteEmployee(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockEmployee.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("should handle delete error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Employee not found" }),
    } as Response);

    const { result } = renderHook(() => useDeleteEmployee(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("non-existent-id");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});
