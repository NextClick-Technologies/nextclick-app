import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/api-utils";
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

    console.log("Adding member to project:", { projectId, employeeId, role });

    // Get the user_id from the employee
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from("employees")
      .select("user_id")
      .eq("id", employeeId)
      .single();

    console.log("Employee lookup result:", { employee, employeeError });

    if (employeeError) {
      console.error("Employee lookup error:", employeeError);
      return apiError(`Employee lookup failed: ${employeeError.message}`, 400);
    }

    type EmployeeResult = { user_id: string | null };
    const employeeResult = employee as unknown as EmployeeResult;

    if (!employeeResult || !employeeResult.user_id) {
      console.error("Employee not linked to user:", employee);
      return apiError(
        "Employee not linked to a user account. Please create a user account for this employee first.",
        400
      );
    }

    const userId = employeeResult.user_id;
    console.log("Using user_id:", userId);

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

    console.log("Inserting member data:", memberData);

    const { data, error } = await supabaseAdmin
      .from("project_members")
      .insert(memberData as never)
      .select("id, role, user_id, users(id, employees(id, name, family_name))")
      .single();

    console.log("Insert result:", { data, error });

    if (error) {
      console.error("Insert error:", error);
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
    console.log("Employee data from response:", employeeData);

    if (!employeeData) {
      console.error("No employee data in response:", data);
      return apiError("User not linked to employee", 500);
    }

    const transformedData = {
      id: employeeData.id,
      name: employeeData.name,
      familyName: employeeData.family_name,
      role: memberResponse.role,
    };

    console.log("Returning transformed data:", transformedData);
    return apiSuccess({ data: transformedData }, 201);
  } catch (error) {
    console.error("Unhandled error in POST /members:", error);
    return handleApiError(error);
  }
}
