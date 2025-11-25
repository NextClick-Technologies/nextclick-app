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
import { projectSchema } from "@/schemas/project.schema";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");

    let query = supabaseAdmin.from("projects").select("*", { count: "exact" });

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = projectSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("projects")
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
