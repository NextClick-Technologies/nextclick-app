/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";

/**
 * Data Access Layer for Project Members
 */

export async function findAllMembers(projectId?: string, employeeId?: string) {
  let query = supabaseAdmin.from("project_members").select(`
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
    `);

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
  return await supabaseAdmin
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
    .single();
}

export async function checkMemberExists(projectId: string, employeeId: string) {
  return await supabaseAdmin
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("employee_id", employeeId)
    .single();
}

export async function findProjectById(projectId: string) {
  return await supabaseAdmin
    .from("projects")
    .select("id, name")
    .eq("id", projectId)
    .single();
}

export async function findEmployeeById(employeeId: string) {
  return await supabaseAdmin
    .from("employees")
    .select("id, name, family_name")
    .eq("id", employeeId)
    .single();
}
