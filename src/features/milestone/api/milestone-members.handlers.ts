/**
 * API Route Handlers for Milestone Members
 * Thin layer that handles HTTP requests/responses and delegates to service layer
 */
import { NextRequest, NextResponse } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
} from "@/shared/lib/api/api-utils";
import * as milestoneMembersService from "../domain/milestone-members.service";

/**
 * POST /api/milestone/[id]/members - Add a member to a milestone
 */
export async function addMilestoneMember(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: milestoneId } = await params;
    const body = await request.json();
    const { employeeId, role } = body;

    if (!employeeId) {
      return apiError("employeeId is required", 400);
    }

    const data = await milestoneMembersService.addMilestoneMember(
      milestoneId,
      employeeId,
      role
    );
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/milestone/[id]/members - Remove a member from a milestone
 */
export async function removeMilestoneMember(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: milestoneId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return apiError("employeeId is required", 400);
    }

    await milestoneMembersService.removeMilestoneMember(
      milestoneId,
      employeeId
    );
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
