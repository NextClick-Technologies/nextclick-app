/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { transformColumnName } from "@/shared/lib/api/api-utils";

/**
 * Data Access Layer for Clients
 * Handles all database interactions
 */

export interface ClientQueryOptions {
  page: number;
  pageSize: number;
  orderBy?: Array<{ column: string; ascending: boolean }>;
  filters?: {
    gender?: string;
  };
}

/**
 * Find all clients with pagination and filters
 */
export async function findAll(options: ClientQueryOptions) {
  const { page, pageSize, orderBy = [], filters = {} } = options;

  let query = supabaseAdmin.from("clients").select("*", { count: "exact" });

  // Apply filters
  if (filters.gender) {
    query = query.eq("gender", filters.gender);
  }

  // Apply ordering
  orderBy.forEach(({ column, ascending }) => {
    query = query.order(transformColumnName(column), { ascending });
  });

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  return await query;
}

/**
 * Find client by ID with optional relations
 */
export async function findById(
  id: string,
  options?: { includeCompany?: boolean }
) {
  const select = options?.includeCompany
    ? "*, company:companies(id, name)"
    : "*";

  return await supabaseAdmin
    .from("clients")
    .select(select)
    .eq("id", id)
    .single();
}

/**
 * Find companies by IDs
 */
export async function findCompaniesByIds(companyIds: string[]) {
  if (companyIds.length === 0) return { data: [], error: null };

  return await supabaseAdmin
    .from("companies")
    .select("id, name")
    .in("id", companyIds);
}

/**
 * Count projects by client IDs
 */
export async function countProjectsByClientIds(clientIds: string[]) {
  if (clientIds.length === 0) return { data: [], error: null };

  return await supabaseAdmin
    .from("projects")
    .select("client_id")
    .in("client_id", clientIds);
}

/**
 * Create a new client
 */
export async function create(data: Record<string, any>) {
  // @ts-expect-error - Supabase type inference issue
  return await supabaseAdmin.from("clients").insert([data]).select().single();
}

/**
 * Update client by ID
 */
export async function update(id: string, data: Record<string, any>) {
  return await supabaseAdmin
    .from("clients")
    // @ts-expect-error - Supabase type inference issue
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
}

/**
 * Delete client by ID
 */
export async function deleteClient(id: string) {
  return await supabaseAdmin.from("clients").delete().eq("id", id);
}

/**
 * Get client IDs accessible to an employee (via their assigned projects)
 * Uses the employee_project_access materialized view for performance
 */
export async function getEmployeeClientIds(userId: string) {
  const { data } = await supabaseAdmin
    .from("employee_project_access")
    .select("client_id")
    .eq("user_id", userId)
    .not("client_id", "is", null);

  return (
    (data as { client_id: string }[] | null)
      ?.map((d) => d.client_id)
      .filter((id): id is string => id !== null) || []
  );
}
