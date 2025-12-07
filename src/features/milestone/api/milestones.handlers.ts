/**
 * API Route Handlers for Milestones
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
  requireAuth,
} from "@/shared/lib/api/auth-middleware";
import { isProjectManager } from "@/features/projects/domain/projects.repository";
import * as milestonesService from "../domain/milestones.service";
import * as milestonesRepository from "../domain/milestones.repository";

/**
 * GET /api/milestone - Get all milestones with pagination
 */
export async function getMilestones(request: NextRequest) {
  try {
    const authResult = await requirePermission(request, "milestones:read");
    if (authResult instanceof NextResponse) return authResult;

    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const projectId = searchParams.get("projectId");

    const result = await milestonesService.getMilestones({
      page,
      pageSize,
      orderBy: parseOrderBy(orderByParam),
      projectId: projectId || undefined,
    });

    return apiSuccess(
      buildPaginatedResponse(result.milestones, page, pageSize, result.count)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/milestone - Create a new milestone
 */
export async function createMilestone(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();

    // Check if user can create milestones for this project
    // Only admin, manager, or project manager can create milestones
    const { userRole, userId } = authResult;
    if (userRole === "viewer" || userRole === "employee") {
      // For employee, check if they're the project manager
      if (userRole === "employee" && body.projectId) {
        const isManager = await isProjectManager(userId, body.projectId);
        if (!isManager) {
          return apiError(
            "Forbidden: Only project managers can create milestones",
            403
          );
        }
      } else {
        return apiError("Forbidden: Insufficient permissions", 403);
      }
    }

    const data = await milestonesService.createMilestone(body);
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/milestone/[id] - Get a specific milestone
 */
export async function getMilestone(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await milestonesService.getMilestoneById(id);
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/milestone/[id] - Update a milestone
 */
export async function updateMilestone(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    // Get milestone to check project
    const { data: milestone } =
      await milestonesRepository.findProjectIdByMilestoneId(id);

    if (!milestone) {
      return apiError("Milestone not found", 404);
    }

    // Check if user can update this milestone
    const { userRole, userId } = authResult;
    if (userRole === "viewer" || userRole === "employee") {
      // For employee, check if they're the project manager
      if (userRole === "employee") {
        const isManager = await isProjectManager(
          userId,
          (milestone as any).project_id
        );
        if (!isManager) {
          return apiError(
            "Forbidden: Only project managers can update milestones",
            403
          );
        }
      } else {
        return apiError("Forbidden: Insufficient permissions", 403);
      }
    }

    const body = await request.json();
    const data = await milestonesService.updateMilestone(id, body);
    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/milestone/[id] - Delete a milestone
 */
export async function deleteMilestone(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;

    // Get milestone to check project
    const { data: milestone } =
      await milestonesRepository.findProjectIdByMilestoneId(id);

    if (!milestone) {
      return apiError("Milestone not found", 404);
    }

    // Check if user can delete this milestone
    const { userRole, userId } = authResult;
    if (userRole === "viewer" || userRole === "employee") {
      // For employee, check if they're the project manager
      if (userRole === "employee") {
        const isManager = await isProjectManager(
          userId,
          (milestone as any).project_id
        );
        if (!isManager) {
          return apiError(
            "Forbidden: Only project managers can delete milestones",
            403
          );
        }
      } else {
        return apiError("Forbidden: Insufficient permissions", 403);
      }
    }

    await milestonesService.deleteMilestone(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
