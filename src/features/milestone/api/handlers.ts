/**
 * API Route Handlers for Milestones
 * Thin layer that handles HTTP requests/responses
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
  transformToDb,
  transformFromDb,
  transformColumnName,
} from "@/shared/lib/api/api-utils";
import {
  requirePermission,
  requireAuth,
} from "@/shared/lib/api/auth-middleware";
import { isProjectManager } from "@/features/projects/domain/projects.repository";
import { milestoneSchema, updateMilestoneSchema } from "../domain/schemas";

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

    let query = supabaseAdmin
      .from("milestones")
      .select(
        `
        *,
        milestone_members (
          id,
          employee_id,
          role,
          deleted_at,
          employees (
            id,
            name,
            family_name
          )
        )
      `,
        { count: "exact" }
      )
      .is("deleted_at", null);

    if (projectId) {
      query = query.eq(transformColumnName("projectId"), projectId);
    }

    const orderByRules = parseOrderBy(orderByParam);
    orderByRules.forEach(({ column, ascending }) => {
      query = query.order(transformColumnName(column), { ascending });
    });

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return apiError(error.message, 500);
    }

    // Transform milestone members to camelCase
    const transformedData = (data || []).map((milestone: any) => {
      const transformed = transformFromDb(milestone) as any;
      if (milestone.milestone_members) {
        // Filter out soft-deleted members
        const activeMembers = milestone.milestone_members.filter(
          (member: any) => !member.deleted_at
        );
        transformed.members = activeMembers.map((member: any) => ({
          id: member.employees.id,
          name: member.employees.name,
          familyName: member.employees.family_name,
          role: member.role,
        }));
      }
      return transformed;
    });

    return apiSuccess(
      buildPaginatedResponse(transformedData, page, pageSize, count || 0)
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
    const validatedData = milestoneSchema.parse(body);

    // Check if user can create milestones for this project
    // Only admin, manager, or project manager can create milestones
    const { userRole, userId } = authResult;
    if (userRole === "viewer" || userRole === "employee") {
      // For employee, check if they're the project manager
      if (userRole === "employee" && validatedData.projectId) {
        const isManager = await isProjectManager(
          userId,
          validatedData.projectId
        );
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

    const { data, error } = await supabaseAdmin
      .from("milestones")
      // @ts-expect-error - Supabase type inference issue with partial updates
      .insert([transformToDb(validatedData)])
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(transformFromDb(data), 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/milestone/[id] - Get a specific milestone
 */
export async function getMilestone(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("milestones")
      .select(
        `
        *,
        milestone_members (
          id,
          employee_id,
          role,
          deleted_at,
          employees (
            id,
            name,
            family_name
          )
        )
      `
      )
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    // Transform milestone members to camelCase
    const transformed: any = transformFromDb(data);
    if ((data as any).milestone_members) {
      // Filter out soft-deleted members
      const activeMembers = (data as any).milestone_members.filter(
        (member: any) => !member.deleted_at
      );
      transformed.members = activeMembers.map((member: any) => ({
        id: member.employees.id,
        name: member.employees.name,
        familyName: member.employees.family_name,
        role: member.role,
      }));
    }

    return apiSuccess(transformed);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/milestone/[id] - Update a milestone
 */
export async function updateMilestone(id: string, request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    // Get milestone to check project
    const { data: milestone } = await supabaseAdmin
      .from("milestones")
      .select("project_id")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

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
    const validatedData = updateMilestoneSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("milestones")
      // @ts-expect-error - Supabase type inference issue with partial updates
      .update({
        ...transformToDb(validatedData),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess(transformFromDb(data));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/milestone/[id] - Delete a milestone
 */
export async function deleteMilestone(id: string, request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;

    // Get milestone to check project
    const { data: milestone } = await supabaseAdmin
      .from("milestones")
      .select("project_id")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

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

    const { error } = await supabaseAdmin
      .from("milestones")
      .update({ deleted_at: new Date().toISOString() } as never)
      .eq("id", id)
      .is("deleted_at", null);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
