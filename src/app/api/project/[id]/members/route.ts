import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/api-utils";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { ProjectMemberInsert } from "@/types/database.type";

// Schema for adding a team member
const addMemberSchema = z.object({
  employeeId: z.string().uuid(),
  role: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { employeeId, role } = addMemberSchema.parse(body);

    logger.info({ projectId, employeeId, role }, "Adding member to project");

    // Get the user_id from the employee
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from("employees")
      .select("user_id")
      .eq("id", employeeId)
      .single();

    logger.debug({ employee, employeeError }, "Employee lookup result");

    if (employeeError) {
      logger.error({ err: employeeError }, "Employee lookup error");
      return apiError(`Employee lookup failed: ${employeeError.message}`, 400);
    }

    type EmployeeResult = { user_id: string | null };
    const employeeResult = employee as unknown as EmployeeResult;

    if (!employeeResult || !employeeResult.user_id) {
      logger.error({ employee }, "Employee not linked to user");
      return apiError(
        "Employee not linked to a user account. Please create a user account for this employee first.",
        400
      );
    }

    const userId = employeeResult.user_id;
    logger.debug({ userId }, "Using user_id");

    // Check if member already exists
    const { data: existing } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      return apiError("Employee is already a team member", 409);
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
      return apiError(error.message, 500);
    }

    if (!data) {
      return apiError("Failed to create team member", 500);
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
      return apiError("User not linked to employee", 500);
    }

    const transformedData = {
      id: employeeData.id,
      name: employeeData.name,
      familyName: employeeData.family_name,
      role: memberResponse.role,
    };

    logger.debug({ transformedData }, "Returning transformed data");
    return apiSuccess({ data: transformedData }, 201);
  } catch (error) {
    logger.error({ err: error }, "Unhandled error in POST /members");
    return handleApiError(error);
  }
}
