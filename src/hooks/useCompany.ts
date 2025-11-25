import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Company } from "@/types/company.type";
import type { DbCompanyInsert, DbCompanyUpdate } from "@/types";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/lib/api/client";

// ===========================
// COMPANY HOOKS
// ===========================

export function useCompanies(params?: QueryParams) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => fetchApi<Company>("company", params),
  });
}

export function useCompany(id: string | null) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => fetchByIdApi<Company>("company", id!),
    enabled: !!id,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      createApi<Company, DbCompanyInsert>("company", data as DbCompanyInsert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      updateApi<Company, DbCompanyUpdate>(
        "company",
        id,
        data as DbCompanyUpdate
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("company", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
