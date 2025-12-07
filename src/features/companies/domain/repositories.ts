/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { transformColumnName } from "@/shared/lib/api/api-utils";

/**
 * Data Access Layer for Companies
 */

export interface CompanyQueryOptions {
  page: number;
  pageSize: number;
  orderBy?: Array<{ column: string; ascending: boolean }>;
}

export async function findAll(options: CompanyQueryOptions) {
  const { page, pageSize, orderBy = [] } = options;

  let query = supabaseAdmin
    .from("companies")
    .select("*", { count: "exact" })
    .is("deleted_at", null);

  orderBy.forEach(({ column, ascending }) => {
    query = query.order(transformColumnName(column), { ascending });
  });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  return await query;
}

export async function findById(id: string) {
  return await supabaseAdmin
    .from("companies")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
}

export async function create(data: Record<string, any>) {
  return await supabaseAdmin
    .from("companies")
    // @ts-expect-error - Supabase type inference issue
    .insert([data])
    .select()
    .single();
}

export async function update(id: string, data: Record<string, any>) {
  return await supabaseAdmin
    .from("companies")
    // @ts-expect-error - Supabase type inference issue
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteCompany(id: string) {
  return await supabaseAdmin
    .from("companies")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id)
    .is("deleted_at", null);
}

/**
 * Get company IDs accessible to an employee (via their assigned projects)
 * Uses the employee_project_access materialized view for performance
 */
export async function getEmployeeCompanyIds(userId: string) {
  // Get client IDs from employee's projects
  const { data: projectData } = await supabaseAdmin
    .from("employee_project_access")
    .select("client_id")
    .eq("user_id", userId)
    .not("client_id", "is", null);

  if (!projectData || projectData.length === 0) {
    return [];
  }

  const clientIds = (projectData as { client_id: string | null }[])
    .map((d) => d.client_id)
    .filter((id): id is string => id !== null);

  if (clientIds.length === 0) {
    return [];
  }

  // Get company IDs from those clients
  const { data: clientsData } = await supabaseAdmin
    .from("clients")
    .select("company_id")
    .in("id", clientIds)
    .not("company_id", "is", null)
    .is("deleted_at", null);

  return (
    (clientsData as { company_id: string | null }[] | null)
      ?.map((c) => c.company_id)
      .filter((id): id is string => id !== null) || []
  );
}
