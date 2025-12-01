import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project } from "../../domain/types";
import type { DbProjectInsert, DbProjectUpdate } from "@/shared/types";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/shared/lib/api/client";

// ===========================
// PROJECT HOOKS
// ===========================

export function useProjects(params?: QueryParams) {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => fetchApi<Project>("project", params),
  });
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchByIdApi<Project>("project", id!),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      createApi<Project, DbProjectInsert>("project", data as DbProjectInsert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateApi<Project, DbProjectUpdate>(
        "project",
        id,
        data as DbProjectUpdate
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("project", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
