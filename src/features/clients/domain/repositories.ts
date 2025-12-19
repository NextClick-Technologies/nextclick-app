/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import { transformColumnName } from "@/shared/lib/api/api-utils";

/**
 * Data Access Layer for Clients
 * Uses user-scoped Supabase client to respect RLS policies
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
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

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
  const supabase = await createSupabaseServerClient();
  const select = options?.includeCompany
    ? "*, company:companies(id, name)"
    : "*";

  return await supabase
    .from("clients")
    .select(select)
    .eq("id", id)
    .is("deleted_at", null)
    .single();
}

/**
 * Find companies by IDs
 */
export async function findCompaniesByIds(companyIds: string[]) {
  if (companyIds.length === 0) return { data: [], error: null };
  const supabase = await createSupabaseServerClient();

  return await supabase
    .from("companies")
    .select("id, name")
    .in("id", companyIds)
    .is("deleted_at", null);
}

/**
 * Count projects by client IDs
 */
export async function countProjectsByClientIds(clientIds: string[]) {
  if (clientIds.length === 0) return { data: [], error: null };
  const supabase = await createSupabaseServerClient();

  return await supabase
    .from("projects")
    .select("client_id")
    .in("client_id", clientIds)
    .is("deleted_at", null);
}

/**
 * Create a new client
 */
export async function create(data: Record<string, any>) {
  const supabase = await createSupabaseServerClient();
  // @ts-expect-error - Supabase type inference issue
  return await supabase.from("clients").insert([data]).select().single();
}

/**
 * Update client by ID
 */
export async function update(id: string, data: Record<string, any>) {
  const supabase = await createSupabaseServerClient();
  return await supabase
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
 * Delete client by ID (soft delete)
 */
export async function deleteClient(id: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("clients")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id)
    .is("deleted_at", null);
}

/**
 * Get client IDs accessible to an employee (via their assigned projects)
 * Uses the employee_project_access materialized view for performance
 */
export async function getEmployeeClientIds(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
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
