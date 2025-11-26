import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/api-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> }
) {
  try {
    const { id: projectId, employeeId } = await params;

    const { error } = await supabaseAdmin
      .from("project_members")
      .delete()
      .eq("project_id", projectId)
      .eq("employee_id", employeeId);

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess({ message: "Team member removed successfully" }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
