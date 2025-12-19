/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import { transformColumnName } from "@/shared/lib/api/api-utils";

/**
 * Data Access Layer for Employees
 * Uses user-scoped Supabase client to respect RLS policies
 */

export interface EmployeeQueryOptions {
  page: number;
  pageSize: number;
  orderBy?: Array<{ column: string; ascending: boolean }>;
}

export async function findAll(options: EmployeeQueryOptions) {
  const { page, pageSize, orderBy = [] } = options;
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("employees")
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
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
}

export async function create(data: Record<string, any>) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("employees")
    // @ts-expect-error - Supabase type inference issue
    .insert([data])
    .select()
    .single();
}

export async function update(id: string, data: Record<string, any>) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("employees")
    // @ts-expect-error - Supabase type inference issue
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteEmployee(id: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("employees")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id)
    .is("deleted_at", null);
}
