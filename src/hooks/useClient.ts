import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Client, ClientInsert, ClientUpdate } from "@/types/database.type";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/lib/api/client";

// ===========================
// CLIENT HOOKS
// ===========================

export function useClients(params?: QueryParams) {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => fetchApi<Client>("client", params),
  });
}

export function useClient(id: string | null) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => fetchByIdApi<Client>("client", id!),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClientInsert) =>
      createApi<Client, ClientInsert>("client", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClientUpdate }) =>
      updateApi<Client, ClientUpdate>("client", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("client", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
