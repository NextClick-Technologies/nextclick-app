import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  transformToDb,
  transformFromDb,
} from "@/shared/lib/api/api-utils";
import { updatePaymentSchema } from "../../services/schemas";

/**
 * GET /api/payment/[id] - Get a specific payment
 */
export async function getPayment(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("payments")
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
 * PATCH /api/payment/[id] - Update a payment
 */
export async function updatePayment(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updatePaymentSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("payments")
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
 * DELETE /api/payment/[id] - Delete a payment
 */
export async function deletePayment(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess({ message: "Payment deleted successfully" }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
