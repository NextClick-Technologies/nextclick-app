/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/lib/supabase/server";
import { transformColumnName } from "@/lib/api/api-utils";

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

  let query = supabaseAdmin.from("projects").select("*", { count: "exact" });

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
       project_members(id, role, user_id, users(id, employees(id, name, family_name)))`
    )
    .eq("id", id)
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
  return await supabaseAdmin.from("projects").delete().eq("id", id);
}
