/**
 * API Route Handlers for Project Members Management
 * Handles global project member operations with authentication and audit logging
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth/auth";
import { createAuditLog } from "@/shared/lib/supabase/auth-client";
import { logger } from "@/shared/lib/logs/logger";
import * as projectMembersService from "../domain/project-members.service";

/**
 * GET /api/project/project-members
 * List project members (with optional project filter)
 */
export async function getProjectMembers(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || undefined;

    // For employee role, we need to get their employee_id from the session
    // For now, we'll pass user.id which should map to employee_id
    // You may need to adjust this based on your auth structure
    const members = await projectMembersService.listProjectMembers(
      projectId,
      session.user.id, // This should be employee_id for employee role
      session.user.role
    );

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Error in project-members GET");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/project/project-members
 * Assign employee to project (Admin/Manager only)
 * Note: Uses userId parameter for backward compatibility but stores employee_id
 */
export async function assignUserToProject(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and managers can assign employees to projects
    if (session.user.role !== "admin" && session.user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Manager access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { projectId, userId, role } = body; // userId is actually employeeId

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Project ID and Employee ID are required" },
        { status: 400 }
      );
    }

    const { member, user, project } =
      await projectMembersService.assignUserToProject({
        projectId,
        userId, // This gets mapped to employeeId in service
        role,
      });

    // Log audit trail
    await createAuditLog({
      user_id: session.user.id,
      action: "assign_project_member",
      resource_type: "project_member",
      resource_id: (member as unknown as { id: string })?.id || "",
      details: {
        project_id: projectId,
        project_name: (project as unknown as { name: string })?.name,
        assigned_employee_id: userId,
        assigned_employee_name: `${
          (user as unknown as { name: string })?.name
        } ${(user as unknown as { family_name: string })?.family_name}`,
        member_role: role,
      },
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee assigned to project successfully",
        member,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Employee not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === "Project not found") {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === "Employee is already assigned to this project") {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }
    logger.error({ err: error }, "Error in assign employee to project");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/project/project-members?id=xxx
 * Remove employee from project by member ID (Admin/Manager only)
 */
export async function removeUserFromProject(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and managers can remove employees from projects
    if (session.user.role !== "admin" && session.user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Manager access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("id");

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      );
    }

    const member = await projectMembersService.removeUserFromProject(memberId);

    // Log audit trail
    await createAuditLog({
      user_id: session.user.id,
      action: "remove_project_member",
      resource_type: "project_member",
      resource_id: memberId,
      details: {
        project_id: (member as unknown as { project_id: string })?.project_id,
        project_name: (member as unknown as { projects?: { name: string } })
          ?.projects?.name,
        removed_employee_id: (member as unknown as { employee_id: string })
          ?.employee_id,
        removed_employee_name: `${
          (member as unknown as { employees?: { name: string } })?.employees
            ?.name
        } ${
          (member as unknown as { employees?: { family_name: string } })
            ?.employees?.family_name
        }`,
      },
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Employee removed from project successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Project member not found"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    logger.error({ err: error }, "Error in remove employee from project");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
