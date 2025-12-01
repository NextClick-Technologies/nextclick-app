import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Milestone } from "@/features/milestone/domain/types/milestone.type";
import type {
  MilestoneInput,
  UpdateMilestoneInput,
} from "@/features/milestone/domain/schemas";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/shared/lib/api/client";

// ===========================
// MILESTONE HOOKS
// ===========================

export function useMilestones(params?: QueryParams) {
  return useQuery({
    queryKey: ["milestones", params],
    queryFn: () => fetchApi<Milestone>("milestone", params),
  });
}

export function useMilestone(id: string | null) {
  return useQuery({
    queryKey: ["milestone", id],
    queryFn: () => fetchByIdApi<Milestone>("milestone", id!),
    enabled: !!id,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MilestoneInput) =>
      createApi<Milestone, MilestoneInput>("milestone", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMilestoneInput }) =>
      updateApi<Milestone, UpdateMilestoneInput>("milestone", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["milestone"] });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("milestone", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}
