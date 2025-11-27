import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiError, handleApiError } from "@/lib/api/api-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> }
) {
  try {
    const { id: projectId, employeeId } = await params;

    console.log("Removing member from project:", { projectId, employeeId });

    // Get the user_id from the employee
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from("employees")
      .select("user_id")
      .eq("id", employeeId)
      .single();

    console.log("Employee lookup result:", { employee, employeeError });

    if (employeeError) {
      console.error("Employee lookup error:", employeeError);
      return apiError("Employee not linked to a user account", 400);
    }

    type EmployeeResult = { user_id: string | null };
    const employeeResult = employee as unknown as EmployeeResult;

    if (!employeeResult || !employeeResult.user_id) {
      console.error("Employee lookup error or no user_id:", { employee });
      return apiError("Employee not linked to a user account", 400);
    }

    const userId = employeeResult.user_id;
    console.log("Deleting with user_id:", userId);

    const { error } = await supabaseAdmin
      .from("project_members")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", userId);

    if (error) {
      console.error("Delete error:", error);
      return apiError(error.message, 500);
    }

    console.log("Member removed successfully");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unhandled error in DELETE /members:", error);
    return handleApiError(error);
  }
}
