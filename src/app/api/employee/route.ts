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
import { employeeSchema } from "@/schemas/employee.schema";
import type { EmployeeInsert } from "@/types/database.type";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");

    let query = supabaseAdmin.from("employees").select("*", { count: "exact" });

    const orderByRules = parseOrderBy(orderByParam);
    orderByRules.forEach(({ column, ascending }) => {
      query = query.order(column, { ascending });
    });

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = employeeSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("employees")
      // @ts-expect-error - Supabase type inference issue with partial updates
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
