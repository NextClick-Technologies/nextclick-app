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

    // Check if member already exists
    const { data: existing } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", employeeId)
      .single();

    if (existing) {
      return apiError("Employee is already a team member", 409);
    }

    // Add the team member
    const memberData: ProjectMemberInsert = {
      project_id: projectId,
      user_id: employeeId,
      role: role || null,
    };

    const { data, error } = await supabaseAdmin
      .from("project_members")
      .insert(memberData as any)
      .select("id, role, member:employees(id, name, family_name)")
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    if (!data) {
      return apiError("Failed to create team member", 500);
    }

    // Transform the response
    const transformedData = {
      id: (data as any).member.id,
      name: (data as any).member.name,
      familyName: (data as any).member.family_name,
      role: (data as any).role,
    };

    return apiSuccess({ data: transformedData }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
