import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Client,
  ClientInsert,
  ClientUpdate,
  Company,
  CompanyInsert,
  CompanyUpdate,
  Project,
  ProjectInsert,
  ProjectUpdate,
  Milestone,
  MilestoneInsert,
  MilestoneUpdate,
  Payment,
  PaymentInsert,
  PaymentUpdate,
  Employee,
  EmployeeInsert,
  EmployeeUpdate,
  CommunicationLog,
  CommunicationLogInsert,
  CommunicationLogUpdate,
} from "@/types/database";

// API Response Types
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface ApiError {
  error: string;
  details?: unknown;
}

// Query Parameters
interface QueryParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  [key: string]: unknown;
}

// Generic API Functions
async function fetchApi<T>(
  endpoint: string,
  params?: QueryParams
): Promise<PaginatedResponse<T>> {
  const url = new URL(`/api/${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to fetch data");
  }
  return response.json();
}

async function fetchByIdApi<T>(
  endpoint: string,
  id: string
): Promise<{ data: T }> {
  const response = await fetch(`/api/${endpoint}/${id}`);
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to fetch data");
  }
  return response.json();
}

async function createApi<T, I>(
  endpoint: string,
  data: I
): Promise<{ data: T }> {
  const response = await fetch(`/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to create data");
  }
  return response.json();
}

async function updateApi<T, U>(
  endpoint: string,
  id: string,
  data: U
): Promise<{ data: T }> {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to update data");
  }
  return response.json();
}

async function deleteApi(endpoint: string, id: string): Promise<void> {
  const response = await fetch(`/api/${endpoint}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.error || "Failed to delete data");
  }
}

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
    mutationFn: (data: CompanyInsert) =>
      createApi<Company, CompanyInsert>("company", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompanyUpdate }) =>
      updateApi<Company, CompanyUpdate>("company", id, data),
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
    mutationFn: (data: ProjectInsert) =>
      createApi<Project, ProjectInsert>("project", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdate }) =>
      updateApi<Project, ProjectUpdate>("project", id, data),
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

// ===========================
// MILESTONE HOOKS
// ===========================

export function useMilestones(params?: QueryParams) {
  return useQuery({
    queryKey: ["milestones", params],
    queryFn: () => fetchApi<Milestone>("milestone", params),
  });
}

export function useMilestone(id: string | null) {
  return useQuery({
    queryKey: ["milestone", id],
    queryFn: () => fetchByIdApi<Milestone>("milestone", id!),
    enabled: !!id,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MilestoneInsert) =>
      createApi<Milestone, MilestoneInsert>("milestone", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MilestoneUpdate }) =>
      updateApi<Milestone, MilestoneUpdate>("milestone", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["milestone"] });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApi("milestone", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
}

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
    mutationFn: (data: PaymentInsert) =>
      createApi<Payment, PaymentInsert>("payment", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaymentUpdate }) =>
      updateApi<Payment, PaymentUpdate>("payment", id, data),
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
    mutationFn: (data: CommunicationLogInsert) =>
      createApi<CommunicationLog, CommunicationLogInsert>(
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
    mutationFn: ({ id, data }: { id: string; data: CommunicationLogUpdate }) =>
      updateApi<CommunicationLog, CommunicationLogUpdate>(
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
