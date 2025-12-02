import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddMemberData {
  projectId: string;
  employeeId: string;
  role?: string;
}

interface RemoveMemberData {
  projectId: string;
  employeeId: string;
}

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, employeeId, role }: AddMemberData) => {
      const response = await fetch(`/api/project/${projectId}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId, role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add team member");
      }

      return response.json();
    },
    onMutate: async ({ projectId, employeeId, role }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData(["project", projectId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["project", projectId], (old: any) => {
        if (!old?.data) return old;

        // Create temporary member (will be replaced with real data on success)
        const optimisticMember = {
          id: employeeId, // Temporary - will be replaced
          name: "Loading",
          familyName: "...",
          role: role || null,
        };

        return {
          ...old,
          data: {
            ...old.data,
            members: [...(old.data.members || []), optimisticMember],
          },
        };
      });

      return { previousProject };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", variables.projectId],
          context.previousProject
        );
      }
    },
    onSuccess: (_, variables) => {
      // Refetch to get accurate server data
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, employeeId }: RemoveMemberData) => {
      const response = await fetch(
        `/api/project/${projectId}/teams/${employeeId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to remove team member");
      }

      return response.status === 204 ? null : response.json();
    },
    onMutate: async ({ projectId, employeeId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["project", projectId] });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData(["project", projectId]);

      // Optimistically remove the member
      queryClient.setQueryData(["project", projectId], (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: {
            ...old.data,
            members: (old.data.members || []).filter(
              (member: TeamMember) => member.id !== employeeId
            ),
          },
        };
      });

      return { previousProject };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProject) {
        queryClient.setQueryData(
          ["project", variables.projectId],
          context.previousProject
        );
      }
    },
    onSuccess: (_, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};
