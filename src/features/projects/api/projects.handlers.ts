/**
 * API Route Handlers for Projects
 * Thin layer that handles HTTP requests/responses and delegates to service layer
 */
import { NextRequest, NextResponse } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
} from "@/shared/lib/api/api-utils";
import {
  requirePermission,
  requireAdminOrManager,
  requireAuth,
} from "@/shared/lib/api/auth-middleware";
import * as projectService from "../domain/projects.service";
import * as projectMembersService from "../domain/project-members.service";
import { isProjectManager } from "../domain/projects.repository";

/**
 * GET /api/project - Get all projects with pagination
 */
export async function getProjects(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, "projects:read");
    if (authResult instanceof NextResponse) return authResult;

    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");

    const result = await projectService.getProjects(
      {
        page,
        pageSize,
        orderBy: parseOrderBy(orderByParam),
      },
      authResult.userId,
      authResult.userRole
    );

    return apiSuccess(
      buildPaginatedResponse(result.projects, page, pageSize, result.count)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/project - Create a new project
 */
export async function createProject(request: NextRequest) {
  try {
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const data = await projectService.createProject(body);
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/project/[id] - Get a single project by ID
 */
export async function getProjectById(id: string, request: NextRequest) {
  try {
    const authResult = await requirePermission(request, "projects:read");
    if (authResult instanceof NextResponse) return authResult;

    const data = await projectService.getProjectById(
      id,
      authResult.userId,
      authResult.userRole
    );
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Project not found") {
      return apiError("Project not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * PATCH /api/project/[id] - Update a project
 */
export async function updateProject(id: string, request: NextRequest) {
  try {
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const data = await projectService.updateProject(id, body);
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Project not found") {
      return apiError("Project not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/project/[id] - Delete a project
 */
export async function deleteProject(id: string, request: NextRequest) {
  try {
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    await projectService.deleteProject(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Project not found") {
      return apiError("Project not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * POST /api/project/[id]/teams
 * Add employee to a specific project team - uses employeeId
 */
export async function addProjectTeamMember(
  projectId: string,
  request: NextRequest
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userRole, userId } = authResult;

    // Check permissions: admin, manager, or project manager can add members
    if (userRole === "viewer") {
      return apiError("Forbidden: Viewers cannot manage team members", 403);
    }

    if (userRole === "employee") {
      const isManager = await isProjectManager(userId, projectId);
      if (!isManager) {
        return apiError(
          "Forbidden: Only project managers can add team members",
          403
        );
      }
    }

    const body = await request.json();
    const data = await projectMembersService.addProjectMember(projectId, body);
    return apiSuccess({ data }, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not linked to a user account")) {
        return apiError(error.message, 400);
      }
      if (error.message.includes("already a team member")) {
        return apiError(error.message, 409);
      }
      if (error.message.includes("Employee lookup failed")) {
        return apiError(error.message, 400);
      }
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/project/[id]/teams/[employeeId]
 * Remove employee from a specific project team - uses employeeId
 */
export async function removeProjectTeamMember(
  projectId: string,
  employeeId: string,
  request: NextRequest
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userRole, userId } = authResult;

    // Check permissions: admin, manager, or project manager can remove members
    if (userRole === "viewer") {
      return apiError("Forbidden: Viewers cannot manage team members", 403);
    }

    if (userRole === "employee") {
      const isManager = await isProjectManager(userId, projectId);
      if (!isManager) {
        return apiError(
          "Forbidden: Only project managers can remove team members",
          403
        );
      }
    }

    await projectMembersService.removeProjectMember(projectId, employeeId);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("not linked to a user account")
    ) {
      return apiError(error.message, 400);
    }
    return handleApiError(error);
  }
}
