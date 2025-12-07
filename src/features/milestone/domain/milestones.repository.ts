/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { transformColumnName } from "@/shared/lib/api/api-utils";

/**
 * Data Access Layer for Milestones
 */

export interface MilestoneQueryOptions {
  page: number;
  pageSize: number;
  orderBy?: Array<{ column: string; ascending: boolean }>;
  projectId?: string;
}

export async function findAll(options: MilestoneQueryOptions) {
  const { page, pageSize, orderBy = [], projectId } = options;

  let query = supabaseAdmin
    .from("milestones")
    .select(
      `
      *,
      milestone_members (
        id,
        employee_id,
        role,
        deleted_at,
        employees (
          id,
          name,
          family_name
        )
      )
    `,
      { count: "exact" }
    )
    .is("deleted_at", null);

  if (projectId) {
    query = query.eq(transformColumnName("projectId"), projectId);
  }

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
    .from("milestones")
    .select(
      `
      *,
      milestone_members (
        id,
        employee_id,
        role,
        deleted_at,
        employees (
          id,
          name,
          family_name
        )
      )
    `
    )
    .eq("id", id)
    .is("deleted_at", null)
    .single();
}

export async function findProjectIdByMilestoneId(milestoneId: string) {
  return await supabaseAdmin
    .from("milestones")
    .select("project_id")
    .eq("id", milestoneId)
    .is("deleted_at", null)
    .single();
}

export async function create(data: Record<string, any>) {
  return await supabaseAdmin
    .from("milestones")
    // @ts-expect-error - Supabase type inference issue
    .insert([data])
    .select()
    .single();
}

export async function update(id: string, data: Record<string, any>) {
  return await supabaseAdmin
    .from("milestones")
    // @ts-expect-error - Supabase type inference issue
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteMilestone(id: string) {
  return await supabaseAdmin
    .from("milestones")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id)
    .is("deleted_at", null);
}
