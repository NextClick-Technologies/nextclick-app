/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logs/logger";
import { MilestoneMemberInsert } from "@/shared/types/database.type";
import * as milestoneMembersRepository from "./milestone-members.repository";

/**
 * Business Logic Layer for Milestone Members
 */

/**
 * Add a team member to a milestone (by employeeId)
 */
export async function addMilestoneMember(
  milestoneId: string,
  employeeId: string,
  role?: string
) {
  logger.info({ milestoneId, employeeId, role }, "Adding member to milestone");

  // Verify employee exists
  const { data: employee, error: employeeError } =
    await milestoneMembersRepository.findEmployeeById(employeeId);

  logger.debug({ employee, employeeError }, "Employee lookup result");

  if (employeeError || !employee) {
    logger.error({ err: employeeError }, "Employee lookup error");
    throw new Error("Employee not found");
  }

  // Verify milestone exists
  const { data: milestone, error: milestoneError } =
    await milestoneMembersRepository.findMilestoneById(milestoneId);

  if (milestoneError || !milestone) {
    logger.error({ err: milestoneError }, "Milestone lookup error");
    throw new Error("Milestone not found");
  }

  // Check if member already exists
  const { data: existing } = await milestoneMembersRepository.checkMemberExists(
    milestoneId,
    employeeId
  );

  if (existing) {
    throw new Error("Employee is already a team member");
  }

  // Add the team member
  const memberData: MilestoneMemberInsert = {
    milestone_id: milestoneId,
    employee_id: employeeId,
    role: role || null,
  };

  logger.info({ memberData }, "Inserting member data");

  const { data, error } = await supabaseAdmin
    .from("milestone_members")
    .insert(memberData as never)
    .select("id, role, employee_id, employees(id, name, family_name)")
    .single();

  logger.debug({ data, error }, "Insert result");

  if (error) {
    logger.error({ err: error }, "Insert error");
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create team member");
  }

  // Transform the response
  type MemberResponse = {
    id: string;
    role: string | null;
    employee_id: string;
    employees: {
      id: string;
      name: string;
      family_name: string;
    };
  };

  const memberResponse = data as unknown as MemberResponse;
  const employeeData = memberResponse.employees;
  logger.debug({ employeeData }, "Employee data from response");

  if (!employeeData) {
    logger.error({ data }, "No employee data in response");
    throw new Error("Employee data not found");
  }

  const transformedData = {
    id: employeeData.id,
    name: employeeData.name,
    familyName: employeeData.family_name,
    role: memberResponse.role,
  };

  logger.debug({ transformedData }, "Returning transformed data");
  return transformedData;
}

/**
 * Remove a team member from a milestone (by employeeId)
 */
export async function removeMilestoneMember(
  milestoneId: string,
  employeeId: string
) {
  logger.info({ milestoneId, employeeId }, "Removing member from milestone");

  const { error } = await milestoneMembersRepository.deleteMember(
    milestoneId,
    employeeId
  );

  if (error) {
    logger.error({ err: error }, "Soft delete error");
    throw new Error(error.message);
  }

  logger.info({ milestoneId, employeeId }, "Member removed successfully");
}
