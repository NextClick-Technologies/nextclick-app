/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { transformColumnName } from "@/shared/lib/api/api-utils";

/**
 * Data Access Layer for Projects
 */

export interface ProjectQueryOptions {
  page: number;
  pageSize: number;
  orderBy?: Array<{ column: string; ascending: boolean }>;
}

export async function findAll(options: ProjectQueryOptions) {
  const { page, pageSize, orderBy = [] } = options;

  let query = supabaseAdmin
    .from("projects")
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
    .from("projects")
    .select(
      `*, 
       client:clients(id, name, family_name), 
       employee:employees(id, name, family_name), 
       project_members(id, role, employee_id, deleted_at, employees(id, name, family_name))`
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();
}

export async function create(data: Record<string, any>) {
  return await supabaseAdmin
    .from("projects")
    // @ts-expect-error - Supabase type inference issue
    .insert([data])
    .select()
    .single();
}

export async function update(id: string, data: Record<string, any>) {
  return await supabaseAdmin
    .from("projects")
    // @ts-expect-error - Supabase type inference issue
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteProject(id: string) {
  return await supabaseAdmin
    .from("projects")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id)
    .is("deleted_at", null);
}

/**
 * Get project IDs accessible to an employee (as member or manager)
 * Uses the employee_project_access materialized view for performance
 */
export async function getEmployeeProjectIds(userId: string) {
  const { data } = await supabaseAdmin
    .from("employee_project_access")
    .select("project_id")
    .eq("user_id", userId);

  return (
    (data as { project_id: string }[] | null)?.map((d) => d.project_id) || []
  );
}

/**
 * Check if employee is the manager of a specific project
 * Uses the employee_project_access materialized view for performance
 */
export async function isProjectManager(userId: string, projectId: string) {
  const { data } = await supabaseAdmin
    .from("employee_project_access")
    .select("access_type")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .eq("access_type", "manager")
    .maybeSingle();

  return !!data;
}
