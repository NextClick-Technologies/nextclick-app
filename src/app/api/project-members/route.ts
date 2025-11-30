import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  createProjectMember,
  deleteProjectMember,
  createAuditLog,
} from "@/lib/supabase/auth-client";
import { logger } from "@/lib/logger";

/**
 * GET /api/project-members
 * List project members (with optional project filter)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let query = supabaseAdmin.from("project_members").select(`
        id,
        project_id,
        user_id,
        role,
        created_at,
        users:user_id (
          id,
          email,
          role
        ),
        projects:project_id (
          id,
          name
        )
      `);

    // Filter by project if provided
    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    // Employees can only see their own memberships
    if (session.user.role === "employee") {
      query = query.eq("user_id", session.user.id);
    }

    const { data: members, error } = await query;

    if (error) {
      logger.error({ err: error, projectId }, "Error fetching project members");
      return NextResponse.json(
        { error: "Failed to fetch project members" },
        { status: 500 }
      );
    }

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
 * POST /api/project-members
 * Add user to project (Admin/Manager only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and managers can assign users to projects
    if (session.user.role !== "admin" && session.user.role !== "manager") {
      return NextResponse.json(
        { error: "Forbidden - Admin or Manager access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { projectId, userId, role } = body;

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Project ID and User ID are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("id", userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if project exists
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("id, name")
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if membership already exists
    const { data: existingMember } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already assigned to this project" },
        { status: 409 }
      );
    }

    // Create project member
    const { data: newMember, error: createError } = await createProjectMember({
      project_id: projectId,
      user_id: userId,
      role: role || null,
    });

    if (createError) {
      logger.error({ err: createError, projectId, userId }, "Error creating project member");
      return NextResponse.json(
        { error: "Failed to assign user to project" },
        { status: 500 }
      );
    }

    // Log audit trail
    await createAuditLog({
      user_id: session.user.id,
      action: "assign_project_member",
      resource_type: "project_member",
      resource_id: (newMember as unknown as { id: string })?.id || "",
      details: {
        project_id: projectId,
        project_name: (project as unknown as { name: string })?.name,
        assigned_user_id: userId,
        assigned_user_email: (user as unknown as { email: string })?.email,
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
        message: "User assigned to project successfully",
        member: newMember,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error({ err: error }, "Error in project-members POST");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/project-members?id=xxx
 * Remove user from project (Admin/Manager only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and managers can remove users from projects
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

    // Get member details before deletion for audit log
    const { data: member } = await supabaseAdmin
      .from("project_members")
      .select(
        `
        id,
        project_id,
        user_id,
        users:user_id (email),
        projects:project_id (name)
      `
      )
      .eq("id", memberId)
      .single();

    if (!member) {
      return NextResponse.json(
        { error: "Project member not found" },
        { status: 404 }
      );
    }

    // Delete project member
    const { error: deleteError } = await deleteProjectMember(memberId);

    if (deleteError) {
      logger.error({ err: deleteError, memberId }, "Error deleting project member");
      return NextResponse.json(
        { error: "Failed to remove user from project" },
        { status: 500 }
      );
    }

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
        removed_user_id: (member as unknown as { user_id: string })?.user_id,
        removed_user_email: (member as unknown as { users?: { email: string } })
          ?.users?.email,
      },
      ip_address:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    });

    return NextResponse.json(
      {
        success: true,
        message: "User removed from project successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error({ err: error }, "Error in project-members DELETE");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
