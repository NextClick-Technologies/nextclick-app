/**
 * Integration tests for Communication Log React Query Hooks
 * Tests hook behavior, data fetching, and mutations
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  useCommunicationLogs,
  useCommunicationLog,
  useCreateCommunicationLog,
  useUpdateCommunicationLog,
  useDeleteCommunicationLog,
} from "../ui/hooks/useCommunicationLog";
import {
  mockCommunicationLog,
  mockCommunicationLogs,
  mockCommunicationLogInsert,
  mockCommunicationLogUpdate,
} from "@/__tests__/fixtures/communication-log.fixtures";

// Mock fetch
const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;

describe("useCommunicationLogs - List Communication Logs", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should fetch communication logs list successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockCommunicationLogs,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockCommunicationLogs.length,
          totalPages: 1,
        },
      }),
    } as Response);

    const { result } = renderHook(() => useCommunicationLogs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockCommunicationLogs);
    expect(result.current.data?.pagination.page).toBe(1);
  });

  it("should handle fetch error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch communication logs" }),
    } as Response);

    const { result } = renderHook(() => useCommunicationLogs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });
});

describe("useCommunicationLog - Get Single Communication Log", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should fetch single communication log by ID", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockCommunicationLog }),
    } as Response);

    const { result } = renderHook(
      () => useCommunicationLog(mockCommunicationLog.id),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockCommunicationLog);
  });

  it("should not fetch if ID is null", async () => {
    const { result } = renderHook(() => useCommunicationLog(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle 404 error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Communication log not found" }),
    } as Response);

    const { result } = renderHook(
      () => useCommunicationLog("non-existent-id"),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useCreateCommunicationLog - Create Communication Log Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should create communication log successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        data: { ...mockCommunicationLog, ...mockCommunicationLogInsert },
      }),
    } as Response);

    const { result } = renderHook(() => useCreateCommunicationLog(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(mockCommunicationLogInsert);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it("should handle create error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Validation failed" }),
    } as Response);

    const { result } = renderHook(() => useCreateCommunicationLog(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCommunicationLogInsert);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useUpdateCommunicationLog - Update Communication Log Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should update communication log successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { ...mockCommunicationLog, ...mockCommunicationLogUpdate },
      }),
    } as Response);

    const { result } = renderHook(() => useUpdateCommunicationLog(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: mockCommunicationLog.id,
      data: mockCommunicationLogUpdate,
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

    const { result } = renderHook(() => useUpdateCommunicationLog(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: mockCommunicationLog.id,
      data: mockCommunicationLogUpdate,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useDeleteCommunicationLog - Delete Communication Log Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should delete communication log successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useDeleteCommunicationLog(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCommunicationLog.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should handle delete error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Delete failed" }),
    } as Response);

    const { result } = renderHook(() => useDeleteCommunicationLog(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockCommunicationLog.id);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
