/**
 * API Route Handlers for Payments
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
import { paymentSchema, updatePaymentSchema } from "../services/schemas";

/**
 * GET /api/payment - Get all payments with pagination
 */
export async function getPayments(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const amount = searchParams.get("amount");

    let query = supabaseAdmin.from("payments").select("*", { count: "exact" });

    if (amount) {
      query = query.eq("amount", amount);
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
 * POST /api/payment - Create a new payment
 */
export async function createPayment(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("payments")
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
 * GET /api/payment/[id] - Get a specific payment
 */
export async function getPayment(id: string) {
  try {
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
export async function updatePayment(id: string, request: NextRequest) {
  try {
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
export async function deletePayment(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("payments")
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
