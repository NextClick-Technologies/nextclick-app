import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Payment } from "@/features/payment/domain/types";
import type { DbPaymentInsert, DbPaymentUpdate } from "@/shared/types";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/shared/lib/api/client";

// ===========================
// PAYMENT HOOKS
// ===========================

export function usePayments(params?: QueryParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => fetchApi<Payment>("payment", params),
  });
}

export function usePayment(id: string | null) {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => fetchByIdApi<Payment>("payment", id!),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DbPaymentInsert) =>
      createApi<Payment, DbPaymentInsert>("payment", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DbPaymentUpdate }) =>
      updateApi<Payment, DbPaymentUpdate>("payment", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("payment", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
