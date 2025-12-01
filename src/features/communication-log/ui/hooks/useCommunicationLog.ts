import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommunicationLog } from "@/features/communication-log/services/types/communication-log.type";
import type {
  DbCommunicationLogInsert,
  DbCommunicationLogUpdate,
} from "@/shared/types";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/shared/lib/api/client";

// ===========================
// COMMUNICATION LOG HOOKS
// ===========================

export function useCommunicationLogs(params?: QueryParams) {
  return useQuery({
    queryKey: ["communicationLogs", params],
    queryFn: () => fetchApi<CommunicationLog>("communication-log", params),
  });
}

export function useCommunicationLog(id: string | null) {
  return useQuery({
    queryKey: ["communicationLog", id],
    queryFn: () => fetchByIdApi<CommunicationLog>("communication-log", id!),
    enabled: !!id,
  });
}

export function useCreateCommunicationLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DbCommunicationLogInsert) =>
      createApi<CommunicationLog, DbCommunicationLogInsert>(
        "communication-log",
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communicationLogs"] });
    },
  });
}

export function useUpdateCommunicationLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: DbCommunicationLogUpdate;
    }) =>
      updateApi<CommunicationLog, DbCommunicationLogUpdate>(
        "communication-log",
        id,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communicationLogs"] });
      queryClient.invalidateQueries({ queryKey: ["communicationLog"] });
    },
  });
}

export function useDeleteCommunicationLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("communication-log", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communicationLogs"] });
    },
  });
}
