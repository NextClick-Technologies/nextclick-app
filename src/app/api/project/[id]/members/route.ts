import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/api-utils";
import { z } from "zod";

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

    // Check if member already exists
    const { data: existing } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("employee_id", employeeId)
      .single();

    if (existing) {
      return apiError("Employee is already a team member", 409);
    }

    // Add the team member
    const { data, error } = await supabaseAdmin
      .from("project_members")
      .insert({
        project_id: projectId,
        employee_id: employeeId,
        role: role || null,
      })
      .select("id, role, member:employees(id, name, family_name)")
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    // Transform the response
    const transformedData = {
      id: data.member.id,
      name: data.member.name,
      familyName: data.member.family_name,
      role: data.role,
    };

    return apiSuccess({ data: transformedData }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
