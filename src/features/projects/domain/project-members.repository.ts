/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

/**
 * Data Access Layer for Project Members
 * Uses user-scoped Supabase client to respect RLS policies
 */

export async function findAllMembers(projectId?: string, employeeId?: string) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("project_members")
    .select(
      `
      id,
      project_id,
      employee_id,
      role,
      created_at,
      employees:employee_id (
        id,
        name,
        family_name
      ),
      projects:project_id (
        id,
        name
      )
    `
    )
    .is("deleted_at", null);

  // Filter by project if provided
  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  // Filter by employee if provided
  if (employeeId) {
    query = query.eq("employee_id", employeeId);
  }

  return await query;
}

export async function findMemberById(memberId: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("project_members")
    .select(
      `
      id,
      project_id,
      employee_id,
      employees:employee_id (id, name, family_name),
      projects:project_id (name)
    `
    )
    .eq("id", memberId)
    .is("deleted_at", null)
    .single();
}

export async function checkMemberExists(projectId: string, employeeId: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("employee_id", employeeId)
    .is("deleted_at", null)
    .single();
}

export async function findProjectById(projectId: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("projects")
    .select("id, name")
    .eq("id", projectId)
    .is("deleted_at", null)
    .single();
}

export async function findEmployeeById(employeeId: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("employees")
    .select("id, name, family_name")
    .eq("id", employeeId)
    .is("deleted_at", null)
    .single();
}

/**
 * Soft delete a project member
 */
export async function deleteMember(memberId: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("project_members")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", memberId)
    .is("deleted_at", null);
}
