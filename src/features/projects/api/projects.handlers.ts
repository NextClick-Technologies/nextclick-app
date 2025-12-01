/**
 * API Route Handlers for Projects
 * Thin layer that handles HTTP requests/responses and delegates to service layer
 */
import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
} from "@/shared/lib/api/api-utils";
import * as projectService from "../services/projects.service";
import * as projectMembersService from "../services/project-members.service";

/**
 * GET /api/project - Get all projects with pagination
 */
export async function getProjects(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");

    const result = await projectService.getProjects({
      page,
      pageSize,
      orderBy: parseOrderBy(orderByParam),
    });

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
export async function getProjectById(id: string) {
  try {
    const data = await projectService.getProjectById(id);
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
export async function deleteProject(id: string) {
  try {
    await projectService.deleteProject(id);
    return apiSuccess({ message: "Project deleted successfully" }, 204);
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
  employeeId: string
) {
  try {
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
