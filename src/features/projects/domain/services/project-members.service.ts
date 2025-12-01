/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logger";
import { ProjectMemberInsert } from "@/shared/types/database.type";
import {
  createProjectMember,
  deleteProjectMember,
} from "@/shared/lib/supabase/auth-client";
import * as projectMembersRepository from "./project-members.repository";
import { addTeamMemberSchema, assignProjectMemberSchema } from "../schemas";

/**
 * Business Logic Layer for Project Members
 */

/**
 * Add a team member to a project (by employeeId)
 */
export async function addProjectMember(projectId: string, input: unknown) {
  const { employeeId, role } = addTeamMemberSchema.parse(input);

  logger.info({ projectId, employeeId, role }, "Adding member to project");

  // Get the user_id from the employee
  const { data: employee, error: employeeError } =
    await projectMembersRepository.findEmployeeById(employeeId);

  logger.debug({ employee, employeeError }, "Employee lookup result");

  if (employeeError) {
    logger.error({ err: employeeError }, "Employee lookup error");
    throw new Error(`Employee lookup failed: ${employeeError.message}`);
  }

  type EmployeeResult = { user_id: string | null };
  const employeeResult = employee as unknown as EmployeeResult;

  if (!employeeResult || !employeeResult.user_id) {
    logger.error({ employee }, "Employee not linked to user");
    throw new Error(
      "Employee not linked to a user account. Please create a user account for this employee first."
    );
  }

  const userId = employeeResult.user_id;
  logger.debug({ userId }, "Using user_id");

  // Check if member already exists
  const { data: existing } = await projectMembersRepository.checkMemberExists(
    projectId,
    userId
  );

  if (existing) {
    throw new Error("Employee is already a team member");
  }

  // Add the team member
  const memberData: ProjectMemberInsert = {
    project_id: projectId,
    user_id: userId,
    role: role || null,
  };

  logger.info({ memberData }, "Inserting member data");

  const { data, error } = await supabaseAdmin
    .from("project_members")
    .insert(memberData as never)
    .select("id, role, user_id, users(id, employees(id, name, family_name))")
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
    user_id: string;
    users: {
      id: string;
      employees: Array<{
        id: string;
        name: string;
        family_name: string;
      }>;
    };
  };

  const memberResponse = data as unknown as MemberResponse;
  const employeeData = memberResponse.users?.employees?.[0];
  logger.debug({ employeeData }, "Employee data from response");

  if (!employeeData) {
    logger.error({ data }, "No employee data in response");
    throw new Error("User not linked to employee");
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
 * Remove a team member from a project (by employeeId)
 */
export async function removeProjectMember(
  projectId: string,
  employeeId: string
) {
  logger.info({ projectId, employeeId }, "Removing member from project");

  // Get the user_id from the employee
  const { data: employee, error: employeeError } =
    await projectMembersRepository.findEmployeeById(employeeId);

  logger.debug({ employee, employeeError }, "Employee lookup result");

  if (employeeError) {
    logger.error({ err: employeeError }, "Employee lookup error");
    throw new Error("Employee not linked to a user account");
  }

  type EmployeeResult = { user_id: string | null };
  const employeeResult = employee as unknown as EmployeeResult;

  if (!employeeResult || !employeeResult.user_id) {
    logger.error({ employee }, "Employee lookup error or no user_id");
    throw new Error("Employee not linked to a user account");
  }

  const userId = employeeResult.user_id;
  logger.debug({ userId }, "Deleting with user_id");

  const { error } = await supabaseAdmin
    .from("project_members")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", userId);

  if (error) {
    logger.error({ err: error }, "Delete error");
    throw new Error(error.message);
  }

  logger.info("Member removed successfully");
  return { success: true };
}

/**
 * List project members with optional project filter
 */
export async function listProjectMembers(
  projectId?: string,
  userId?: string,
  userRole?: string
) {
  // Employees can only see their own memberships
  const filterUserId = userRole === "employee" ? userId : undefined;

  const { data: members, error } =
    await projectMembersRepository.findAllMembers(projectId, filterUserId);

  if (error) {
    logger.error({ err: error, projectId }, "Error fetching project members");
    throw new Error("Failed to fetch project members");
  }

  return members;
}

/**
 * Assign user to project (Admin/Manager only)
 */
export async function assignUserToProject(input: unknown) {
  const { projectId, userId, role } = assignProjectMemberSchema.parse(input);

  // Check if user exists
  const { data: user } = await projectMembersRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Check if project exists
  const { data: project } = await projectMembersRepository.findProjectById(
    projectId
  );

  if (!project) {
    throw new Error("Project not found");
  }

  // Check if membership already exists
  const { data: existingMember } =
    await projectMembersRepository.checkMemberExists(projectId, userId);

  if (existingMember) {
    throw new Error("User is already assigned to this project");
  }

  // Create project member
  const { data: newMember, error: createError } = await createProjectMember({
    project_id: projectId,
    user_id: userId,
    role: role || null,
  });

  if (createError) {
    logger.error(
      { err: createError, projectId, userId },
      "Error creating project member"
    );
    throw new Error("Failed to assign user to project");
  }

  return {
    member: newMember,
    user,
    project,
  };
}

/**
 * Remove user from project by member ID (Admin/Manager only)
 */
export async function removeUserFromProject(memberId: string) {
  // Get member details before deletion for audit log
  const { data: member } = await projectMembersRepository.findMemberById(
    memberId
  );

  if (!member) {
    throw new Error("Project member not found");
  }

  // Delete project member
  const { error: deleteError } = await deleteProjectMember(memberId);

  if (deleteError) {
    logger.error(
      { err: deleteError, memberId },
      "Error deleting project member"
    );
    throw new Error("Failed to remove user from project");
  }

  return member;
}
