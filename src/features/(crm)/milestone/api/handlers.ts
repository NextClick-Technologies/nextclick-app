/**
 * API Route Handlers for Milestones
 * Thin layer that handles HTTP requests/responses
 */
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
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
} from "@/lib/api/api-utils";
import { milestoneSchema, updateMilestoneSchema } from "../services/schemas";

/**
 * GET /api/milestone - Get all milestones with pagination
 */
export async function getMilestones(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const projectId = searchParams.get("projectId");

    let query = supabaseAdmin
      .from("milestones")
      .select("*", { count: "exact" });

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

    return apiSuccess(
      buildPaginatedResponse(
        transformFromDb<unknown[]>(data || []),
        page,
        pageSize,
        count || 0
      )
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
    const body = await request.json();
    const validatedData = milestoneSchema.parse(body);

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
      .select("*")
      .eq("id", id)
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
 * PATCH /api/milestone/[id] - Update a milestone
 */
export async function updateMilestone(id: string, request: NextRequest) {
  try {
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
export async function deleteMilestone(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("milestones")
      .delete()
      .eq("id", id);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess({ message: "Milestone deleted successfully" }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
