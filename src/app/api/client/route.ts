import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
} from "@/lib/api/api-utils";
import { clientSchema } from "@/schemas/client.schema";

// GET /api/client - Get all clients with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const genderFilter = searchParams.get("gender");

    let query = supabaseAdmin.from("clients").select("*", { count: "exact" });

    // Apply filters
    if (genderFilter) {
      query = query.eq("gender", genderFilter);
    }

    // Apply ordering
    const orderByRules = parseOrderBy(orderByParam);
    orderByRules.forEach(({ column, ascending }) => {
      query = query.order(column, { ascending });
    });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(
      buildPaginatedResponse(data || [], page, pageSize, count || 0)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/client - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = clientSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("clients")
      // @ts-expect-error - Supabase type inference issue with insert
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
