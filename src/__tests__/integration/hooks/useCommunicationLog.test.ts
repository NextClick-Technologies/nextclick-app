/**
 * Integration Tests for Communication Log React Query Hooks
 *
 * Tests all CRUD operations using React Query hooks with fetch mocking.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  useCommunicationLogs,
  useCommunicationLog,
  useCreateCommunicationLog,
  useUpdateCommunicationLog,
} from "@/hooks/useCommunicationLog";
import {
  mockCommunicationLog,
  mockCommunicationLogs,
  mockCommunicationLogInsert,
  mockCommunicationLogUpdate,
} from "@/__tests__/fixtures/communication-log.fixtures";

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
  fetchSpy = jest.spyOn(global, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe("useCommunicationLogs - Fetch Paginated Communication Logs", () => {
  it("should fetch communication logs successfully", async () => {
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
    expect(result.current.error).toBeNull();
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
  });
});

describe("useCommunicationLog - Fetch Single Communication Log", () => {
  it("should fetch communication log by id successfully", async () => {
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
    expect(result.current.data).toEqual({ data: mockCommunicationLog });
  });

  it("should not fetch when id is null", async () => {
    const { result } = renderHook(() => useCommunicationLog(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateCommunicationLog - Create Communication Log Mutation", () => {
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
      status: 404,
      json: async () => ({ error: "Communication log not found" }),
    } as Response);

    const { result } = renderHook(() => useUpdateCommunicationLog(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: "non-existent-id",
      data: mockCommunicationLogUpdate,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});
