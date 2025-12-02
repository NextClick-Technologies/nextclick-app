import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddMilestoneTeamMemberInput } from "@/features/milestone/domain/schemas";

/**
 * Hook to add a team member to a milestone
 */
export function useAddMilestoneMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      milestoneId,
      employeeId,
      role,
    }: {
      milestoneId: string;
      employeeId: string;
      role?: string;
    }) => {
      const response = await fetch(`/api/milestone/${milestoneId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          role,
        } as AddMilestoneTeamMemberInput),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add team member");
      }

      return response.json();
    },
    onSuccess: (_, { milestoneId }) => {
      // Invalidate milestone queries to refetch with updated members
      queryClient.invalidateQueries({ queryKey: ["milestone", milestoneId] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}

/**
 * Hook to remove a team member from a milestone
 */
export function useRemoveMilestoneMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      milestoneId,
      employeeId,
    }: {
      milestoneId: string;
      employeeId: string;
    }) => {
      const response = await fetch(
        `/api/milestone/${milestoneId}/members?employeeId=${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove team member");
      }

      return response.json();
    },
    onSuccess: (_, { milestoneId }) => {
      // Invalidate milestone queries to refetch with updated members
      queryClient.invalidateQueries({ queryKey: ["milestone", milestoneId] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}
