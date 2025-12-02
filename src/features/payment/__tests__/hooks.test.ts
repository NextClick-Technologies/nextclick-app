/**
 * Integration tests for Payment React Query Hooks
 * Tests hook behavior, data fetching, and mutations
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  usePayments,
  usePayment,
  useCreatePayment,
  useUpdatePayment,
  useDeletePayment,
} from "../ui/hooks/usePayment";
import {
  mockPayment,
  mockPayments,
  mockPaymentInsert,
  mockPaymentUpdate,
} from "@/__tests__/fixtures/payment.fixtures";

// Mock fetch
const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;

describe("usePayments - List Payments", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should fetch payments list successfully", async () => {
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
    expect(result.current.data?.pagination.page).toBe(1);
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
    expect(result.current.data).toBeUndefined();
  });
});

describe("usePayment - Get Single Payment", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should fetch single payment by ID", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockPayment }),
    } as Response);

    const { result } = renderHook(() => usePayment(mockPayment.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockPayment);
  });

  it("should not fetch if ID is null", async () => {
    const { result } = renderHook(() => usePayment(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle 404 error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Payment not found" }),
    } as Response);

    const { result } = renderHook(() => usePayment("non-existent-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useCreatePayment - Create Payment Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

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

    expect(result.current.isIdle).toBe(true);

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
  beforeEach(() => {
    fetchSpy.mockClear();
  });

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

    result.current.mutate({
      id: mockPayment.id,
      data: mockPaymentUpdate,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it("should handle update error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Update failed" }),
    } as Response);

    const { result } = renderHook(() => useUpdatePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: mockPayment.id,
      data: mockPaymentUpdate,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useDeletePayment - Delete Payment Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should delete payment successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useDeletePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPayment.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should handle delete error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Delete failed" }),
    } as Response);

    const { result } = renderHook(() => useDeletePayment(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockPayment.id);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
