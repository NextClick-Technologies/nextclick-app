/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";

/**
 * Data Access Layer for Project Members
 */

export async function findAllMembers(projectId?: string, userId?: string) {
  let query = supabaseAdmin.from("project_members").select(`
      id,
      project_id,
      user_id,
      role,
      created_at,
      users:user_id (
        id,
        email,
        role
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

  // Filter by user if provided
  if (userId) {
    query = query.eq("user_id", userId);
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
      user_id,
      users:user_id (email),
      projects:project_id (name)
    `
    )
    .eq("id", memberId)
    .single();
}

export async function checkMemberExists(projectId: string, userId: string) {
  return await supabaseAdmin
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .single();
}

export async function findUserById(userId: string) {
  return await supabaseAdmin
    .from("users")
    .select("id, email")
    .eq("id", userId)
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
    .select("user_id")
    .eq("id", employeeId)
    .single();
}
