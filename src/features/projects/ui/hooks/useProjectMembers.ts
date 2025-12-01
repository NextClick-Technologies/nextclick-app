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
      const response = await fetch(`/api/project/${projectId}/members`, {
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
    onSuccess: (_, variables) => {
      // Invalidate project query to refetch with new member
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
        `/api/project/${projectId}/members/${employeeId}`,
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
    onSuccess: (_, variables) => {
      // Invalidate project query to refetch without removed member
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};
