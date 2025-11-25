import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Milestone } from "@/types/milestone.type";
import type { DbMilestoneInsert, DbMilestoneUpdate } from "@/types";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/lib/api/client";

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
    mutationFn: (data: DbMilestoneInsert) =>
      createApi<Milestone, DbMilestoneInsert>("milestone", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DbMilestoneUpdate }) =>
      updateApi<Milestone, DbMilestoneUpdate>("milestone", id, data),
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
