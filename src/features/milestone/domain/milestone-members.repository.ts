/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";

/**
 * Data Access Layer for Milestone Members
 */

export async function findAllMembers(
  milestoneId?: string,
  employeeId?: string
) {
  let query = supabaseAdmin
    .from("milestone_members")
    .select(
      `
      id,
      milestone_id,
      employee_id,
      role,
      created_at,
      employees:employee_id (
        id,
        name,
        family_name
      ),
      milestones:milestone_id (
        id,
        name
      )
    `
    )
    .is("deleted_at", null);

  if (milestoneId) {
    query = query.eq("milestone_id", milestoneId);
  }

  if (employeeId) {
    query = query.eq("employee_id", employeeId);
  }

  return await query;
}

export async function findMemberById(memberId: string) {
  return await supabaseAdmin
    .from("milestone_members")
    .select(
      `
      id,
      milestone_id,
      employee_id,
      employees:employee_id (id, name, family_name),
      milestones:milestone_id (name)
    `
    )
    .eq("id", memberId)
    .is("deleted_at", null)
    .single();
}

export async function checkMemberExists(
  milestoneId: string,
  employeeId: string
) {
  return await supabaseAdmin
    .from("milestone_members")
    .select("id")
    .eq("milestone_id", milestoneId)
    .eq("employee_id", employeeId)
    .is("deleted_at", null)
    .single();
}

export async function findMilestoneById(milestoneId: string) {
  return await supabaseAdmin
    .from("milestones")
    .select("id, name")
    .eq("id", milestoneId)
    .is("deleted_at", null)
    .single();
}

export async function findEmployeeById(employeeId: string) {
  return await supabaseAdmin
    .from("employees")
    .select("id, name, family_name")
    .eq("id", employeeId)
    .is("deleted_at", null)
    .single();
}

/**
 * Soft delete a milestone member
 */
export async function deleteMember(milestoneId: string, employeeId: string) {
  return await supabaseAdmin
    .from("milestone_members")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("milestone_id", milestoneId)
    .eq("employee_id", employeeId)
    .is("deleted_at", null);
}
