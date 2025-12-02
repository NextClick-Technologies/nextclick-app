/**
 * Integration tests for Milestone React Query Hooks
 * Tests hook behavior, data fetching, and mutations
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  useMilestones,
  useMilestone,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
} from "../ui/hooks/useMilestone";
import {
  mockMilestone,
  mockMilestones,
  mockMilestoneInput,
  mockMilestoneUpdateInput,
} from "@/__tests__/fixtures/milestone.fixtures";

// Mock fetch
const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;

describe("useMilestones - List Milestones", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should fetch milestones list successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: mockMilestones,
        pagination: {
          page: 1,
          pageSize: 10,
          total: mockMilestones.length,
          totalPages: 1,
        },
      }),
    } as Response);

    const { result } = renderHook(() => useMilestones(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockMilestones);
    expect(result.current.data?.pagination.page).toBe(1);
  });

  it("should handle fetch error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch milestones" }),
    } as Response);

    const { result } = renderHook(() => useMilestones(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });
});

describe("useMilestone - Get Single Milestone", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should fetch single milestone by ID", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockMilestone }),
    } as Response);

    const { result } = renderHook(() => useMilestone(mockMilestone.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toEqual(mockMilestone);
  });

  it("should not fetch if ID is null", async () => {
    const { result } = renderHook(() => useMilestone(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle 404 error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Milestone not found" }),
    } as Response);

    const { result } = renderHook(() => useMilestone("non-existent-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useCreateMilestone - Create Milestone Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should create milestone successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        data: { ...mockMilestone, ...mockMilestoneInput },
      }),
    } as Response);

    const { result } = renderHook(() => useCreateMilestone(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(mockMilestoneInput);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it("should handle create error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Validation failed" }),
    } as Response);

    const { result } = renderHook(() => useCreateMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockMilestoneInput);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useUpdateMilestone - Update Milestone Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should update milestone successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { ...mockMilestone, ...mockMilestoneUpdateInput },
      }),
    } as Response);

    const { result } = renderHook(() => useUpdateMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: mockMilestone.id,
      data: mockMilestoneUpdateInput,
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

    const { result } = renderHook(() => useUpdateMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: mockMilestone.id,
      data: mockMilestoneUpdateInput,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});

describe("useDeleteMilestone - Delete Milestone Mutation", () => {
  beforeEach(() => {
    fetchSpy.mockClear();
  });

  it("should delete milestone successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useDeleteMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockMilestone.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("should handle delete error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Delete failed" }),
    } as Response);

    const { result } = renderHook(() => useDeleteMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockMilestone.id);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });
});
