import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  transformToDb,
  transformFromDb,
} from "@/lib/api/api-utils";
import { updateCommunicationLogSchema } from "../../services/schemas";

/**
 * GET /api/communication-log/[id] - Get a specific communication log
 */
export async function getCommunicationLog(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
export async function updateCommunicationLog(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
export async function deleteCommunicationLog(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("communication_logs")
      .delete()
      .eq("id", id);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess(
      { message: "Communication log deleted successfully" },
      204
    );
  } catch (error) {
    return handleApiError(error);
  }
}
