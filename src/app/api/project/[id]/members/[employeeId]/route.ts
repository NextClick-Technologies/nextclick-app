import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiError, handleApiError } from "@/lib/api/api-utils";
import { logger } from "@/lib/logger";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> }
) {
  try {
    const { id: projectId, employeeId } = await params;

    logger.info({ projectId, employeeId }, "Removing member from project");

    // Get the user_id from the employee
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from("employees")
      .select("user_id")
      .eq("id", employeeId)
      .single();

    logger.debug({ employee, employeeError }, "Employee lookup result");

    if (employeeError) {
      logger.error({ err: employeeError }, "Employee lookup error");
      return apiError("Employee not linked to a user account", 400);
    }

    type EmployeeResult = { user_id: string | null };
    const employeeResult = employee as unknown as EmployeeResult;

    if (!employeeResult || !employeeResult.user_id) {
      logger.error({ employee }, "Employee lookup error or no user_id");
      return apiError("Employee not linked to a user account", 400);
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
      return apiError(error.message, 500);
    }

    logger.info("Member removed successfully");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error({ err: error }, "Unhandled error in DELETE /members");
    return handleApiError(error);
  }
}
