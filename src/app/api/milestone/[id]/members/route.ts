import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
} from "@/shared/lib/api/api-utils";
import { addMilestoneTeamMemberSchema } from "@/features/milestone/domain/schemas";

type MilestoneWithProject = {
  id: string;
  project_id: string;
};

type MilestoneMemberWithEmployee = {
  id: string;
  milestone_id: string;
  employee_id: string;
  role: string | null;
  created_at: string;
  employees: {
    id: string;
    name: string;
    family_name: string;
  } | null;
};

/**
 * POST /api/milestone/[id]/members
 * Add a team member to a milestone
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: milestoneId } = await params;
    const body = await request.json();
    const validatedData = addMilestoneTeamMemberSchema.parse(body);

    // First, verify that the milestone exists and get its project
    const { data: milestone, error: milestoneError } = await supabaseAdmin
      .from("milestones")
      .select("id, project_id")
      .eq("id", milestoneId)
      .single();

    if (milestoneError || !milestone) {
      return apiError("Milestone not found", 404);
    }

    const typedMilestone = milestone as MilestoneWithProject;

    // Verify that the employee is a member of the project
    const { data: projectMember, error: projectMemberError } =
      await supabaseAdmin
        .from("project_members")
        .select("id")
        .eq("project_id", typedMilestone.project_id)
        .eq("employee_id", validatedData.employeeId)
        .single();

    if (projectMemberError || !projectMember) {
      return apiError(
        "Employee must be a project team member before being assigned to a milestone",
        400
      );
    }

    // Add the member to the milestone
    const { data, error } = await supabaseAdmin
      .from("milestone_members")
      .insert([
        {
          milestone_id: milestoneId,
          employee_id: validatedData.employeeId,
          role: validatedData.role || null,
        } as never,
      ])
      .select(
        `
        id,
        milestone_id,
        employee_id,
        role,
        created_at,
        employees (
          id,
          name,
          family_name
        )
      `
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return apiError("Employee is already assigned to this milestone", 409);
      }
      return apiError(error.message, 500);
    }

    const typedData = data as MilestoneMemberWithEmployee;

    return apiSuccess(
      {
        id: typedData.id,
        milestoneId: typedData.milestone_id,
        employeeId: typedData.employee_id,
        role: typedData.role,
        createdAt: typedData.created_at,
        employee: typedData.employees
          ? {
              id: typedData.employees.id,
              name: typedData.employees.name,
              familyName: typedData.employees.family_name,
            }
          : null,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/milestone/[id]/members/[employeeId]
 * Remove a team member from a milestone
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: milestoneId } = await params;
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return apiError("Employee ID is required", 400);
    }

    const { error } = await supabaseAdmin
      .from("milestone_members")
      .delete()
      .eq("milestone_id", milestoneId)
      .eq("employee_id", employeeId);

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
