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
    onMutate: async ({ milestoneId, employeeId, role }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["milestone", milestoneId] });
      await queryClient.cancelQueries({ queryKey: ["milestones"] });

      // Snapshot previous values
      const previousMilestone = queryClient.getQueryData([
        "milestone",
        milestoneId,
      ]);
      const previousMilestones = queryClient.getQueryData(["milestones"]);

      // Optimistically update milestone query
      queryClient.setQueryData(["milestone", milestoneId], (old: any) => {
        if (!old) return old;

        const optimisticMember = {
          id: employeeId,
          name: "Loading",
          familyName: "...",
          role: role || null,
        };

        return {
          ...old,
          members: [...(old.members || []), optimisticMember],
        };
      });

      // Optimistically update milestones list query
      queryClient.setQueryData(["milestones"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((milestone: any) => {
            if (milestone.id === milestoneId) {
              const optimisticMember = {
                id: employeeId,
                name: "Loading",
                familyName: "...",
                role: role || null,
              };
              return {
                ...milestone,
                members: [...(milestone.members || []), optimisticMember],
              };
            }
            return milestone;
          }),
        };
      });

      return { previousMilestone, previousMilestones };
    },
    onError: (err, { milestoneId }, context) => {
      // Rollback on error
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          ["milestone", milestoneId],
          context.previousMilestone
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(["milestones"], context.previousMilestones);
      }
    },
    onSuccess: (_, { milestoneId }) => {
      // Refetch to get accurate server data
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
    onMutate: async ({ milestoneId, employeeId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["milestone", milestoneId] });
      await queryClient.cancelQueries({ queryKey: ["milestones"] });

      // Snapshot previous values
      const previousMilestone = queryClient.getQueryData([
        "milestone",
        milestoneId,
      ]);
      const previousMilestones = queryClient.getQueryData(["milestones"]);

      // Optimistically remove from milestone query
      queryClient.setQueryData(["milestone", milestoneId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          members: (old.members || []).filter(
            (member: any) => member.id !== employeeId
          ),
        };
      });

      // Optimistically remove from milestones list query
      queryClient.setQueryData(["milestones"], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((milestone: any) => {
            if (milestone.id === milestoneId) {
              return {
                ...milestone,
                members: (milestone.members || []).filter(
                  (member: any) => member.id !== employeeId
                ),
              };
            }
            return milestone;
          }),
        };
      });

      return { previousMilestone, previousMilestones };
    },
    onError: (err, { milestoneId }, context) => {
      // Rollback on error
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          ["milestone", milestoneId],
          context.previousMilestone
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(["milestones"], context.previousMilestones);
      }
    },
    onSuccess: (_, { milestoneId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["milestone", milestoneId] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}
