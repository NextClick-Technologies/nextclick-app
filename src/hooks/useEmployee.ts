import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Employee,
  EmployeeInsert,
  EmployeeUpdate,
} from "@/types/database.type";
import {
  fetchApi,
  fetchByIdApi,
  createApi,
  updateApi,
  deleteApi,
  type QueryParams,
} from "@/lib/api/client";

// ===========================
// EMPLOYEE HOOKS
// ===========================

export function useEmployees(params?: QueryParams) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => fetchApi<Employee>("employee", params),
  });
}

export function useEmployee(id: string | null) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchByIdApi<Employee>("employee", id!),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeInsert) =>
      createApi<Employee, EmployeeInsert>("employee", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeUpdate }) =>
      updateApi<Employee, EmployeeUpdate>("employee", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("employee", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
