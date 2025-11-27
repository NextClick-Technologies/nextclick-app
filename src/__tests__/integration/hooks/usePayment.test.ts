/**
 * Integration Tests for Payment React Query Hooks
 *
 * Tests all CRUD operations using React Query hooks with fetch mocking.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  usePayments,
  usePayment,
  useCreatePayment,
  useUpdatePayment,
  useDeletePayment,
} from "@/hooks/usePayment";
import {
  mockPayment,
  mockPayments,
  mockPaymentInsert,
  mockPaymentUpdate,
} from "@/__tests__/fixtures/payment.fixtures";

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
  fetchSpy = jest.spyOn(global, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe("usePayments - Fetch Paginated Payments", () => {
  it("should fetch payments successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockPayments,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockPayments.length,
          totalPages: 1,
        },
      }),
    } as Response);

    const { result } = renderHook(() => usePayments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockPayments);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch payments" }),
    } as Response);

    const { result } = renderHook(() => usePayments(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("usePayment - Fetch Single Payment", () => {
  it("should fetch payment by id successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockPayment }),
    } as Response);

    const { result } = renderHook(() => usePayment(mockPayment.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ data: mockPayment });
  });

  it("should not fetch when id is null", async () => {
    const { result } = renderHook(() => usePayment(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreatePayment - Create Payment Mutation", () => {
  it("should create payment successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        data: { ...mockPayment, ...mockPaymentInsert },
      }),
    } as Response);

    const { result } = renderHook(() => useCreatePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPaymentInsert);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("should handle create error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Validation failed" }),
    } as Response);

    const { result } = renderHook(() => useCreatePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPaymentInsert);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("useUpdatePayment - Update Payment Mutation", () => {
  it("should update payment successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { ...mockPayment, ...mockPaymentUpdate },
      }),
    } as Response);

    const { result } = renderHook(() => useUpdatePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: mockPayment.id, data: mockPaymentUpdate });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("should handle update error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Payment not found" }),
    } as Response);

    const { result } = renderHook(() => useUpdatePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "non-existent-id", data: mockPaymentUpdate });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("useDeletePayment - Delete Payment Mutation", () => {
  it("should delete payment successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    const { result } = renderHook(() => useDeletePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPayment.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("should handle delete error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Payment not found" }),
    } as Response);

    const { result } = renderHook(() => useDeletePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("non-existent-id");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});
