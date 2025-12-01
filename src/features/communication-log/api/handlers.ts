/**
 * API Route Handlers for Communication Logs
 * Thin layer that handles HTTP requests/responses
 */
import { NextRequest } from "next/server";
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
  communicationLogSchema,
  updateCommunicationLogSchema,
} from "../domain/schemas";

/**
 * GET /api/communication-log - Get all communication logs with pagination
 */
export async function getCommunicationLogs(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const clientId = searchParams.get("clientId");

    let query = supabaseAdmin
      .from("communication_logs")
      .select("*", { count: "exact" });

    if (clientId) {
      query = query.eq(transformColumnName("clientId"), clientId);
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
 * POST /api/communication-log - Create a new communication log
 */
export async function createCommunicationLog(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = communicationLogSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("communication_logs")
      // @ts-expect-error - Supabase type inference issue with insert
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
 * GET /api/communication-log/[id] - Get a specific communication log
 */
export async function getCommunicationLog(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("communication_logs")
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
 * PATCH /api/communication-log/[id] - Update a communication log
 */
export async function updateCommunicationLog(id: string, request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = updateCommunicationLogSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("communication_logs")
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
 * DELETE /api/communication-log/[id] - Delete a communication log
 */
export async function deleteCommunicationLog(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("communication_logs")
      .delete()
      .eq("id", id);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
