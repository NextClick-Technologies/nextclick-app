/**
 * Integration Tests for Milestone React Query Hooks
 *
 * Tests all CRUD operations using React Query hooks with fetch mocking.
 */

import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "@/__tests__/utils/test-utils";
import {
  useMilestones,
  useMilestone,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
} from "@/features/milestone/ui/hooks/useMilestone";
import type {
  MilestoneInput,
  UpdateMilestoneInput,
} from "@/features/milestone/domain/schemas";
import {
  mockMilestone,
  mockMilestones,
  mockMilestoneUpdate,
} from "@/__tests__/fixtures/milestone.fixtures";
import { MilestoneStatus } from "@/features/milestone/domain/types";

// Frontend-style (camelCase) milestone input for testing
const mockMilestoneInput: MilestoneInput = {
  name: "Phase 3: Testing",
  description: "Quality assurance and testing",
  startDate: "2024-04-21",
  finishDate: "2024-05-20",
  status: MilestoneStatus.PENDING,
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  order: 3,
};

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
  fetchSpy = jest.spyOn(global, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe("useMilestones - Fetch Paginated Milestones", () => {
  it("should fetch milestones successfully", async () => {
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
    expect(result.current.error).toBeNull();
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
  });
});

describe("useMilestone - Fetch Single Milestone", () => {
  it("should fetch milestone by id successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockMilestone }),
    } as Response);

    const { result } = renderHook(() => useMilestone(mockMilestone.id), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ data: mockMilestone });
  });

  it("should not fetch when id is null", async () => {
    const { result } = renderHook(() => useMilestone(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCreateMilestone - Create Milestone Mutation", () => {
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
  it("should update milestone successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: { ...mockMilestone, ...mockMilestoneUpdate },
      }),
    } as Response);

    const { result } = renderHook(() => useUpdateMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: mockMilestone.id, data: mockMilestoneUpdate });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it("should handle update error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Milestone not found" }),
    } as Response);

    const { result } = renderHook(() => useUpdateMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "non-existent-id", data: mockMilestoneUpdate });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});

describe("useDeleteMilestone - Delete Milestone Mutation", () => {
  it("should delete milestone successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response);

    const { result } = renderHook(() => useDeleteMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(mockMilestone.id);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("should handle delete error", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: "Milestone not found" }),
    } as Response);

    const { result } = renderHook(() => useDeleteMilestone(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("non-existent-id");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeTruthy();
  });
});
