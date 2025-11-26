/* eslint-disable @typescript-eslint/no-explicit-any */
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
      query = query.order(transformColumnName(column), { ascending });
    });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return apiError(error.message, 500);
    }

    // Fetch companies for all clients
    const companyIds = [
      ...new Set(
        (data as any[])?.map((client: any) => client.company_id).filter(Boolean)
      ),
    ];
    let companies: any[] = [];
    if (companyIds.length > 0) {
      const { data: companiesData } = await supabaseAdmin
        .from("companies")
        .select("id, name")
        .in("id", companyIds);
      companies = companiesData || [];
    }

    // Fetch project counts for all clients
    const clientIds = (data as any[])?.map((client: any) => client.id) || [];
    let projectCounts: Array<{ clientId: string; count: number }> = [];
    if (clientIds.length > 0) {
      const { data: projectsData } = await supabaseAdmin
        .from("projects")
        .select("client_id")
        .in("client_id", clientIds);

      // Count projects per client
      const countsMap = ((projectsData as any[]) || []).reduce(
        (acc: Record<string, number>, project: any) => {
          acc[project.client_id] = (acc[project.client_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      projectCounts = Object.entries(countsMap).map(([clientId, count]) => ({
        clientId,
        count,
      }));
    }

    return apiSuccess(
      buildPaginatedResponse(
        transformFromDb<unknown[]>(data || []),
        page,
        pageSize,
        count || 0,
        {
          companies: transformFromDb(companies),
          projectCounts,
        }
      )
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
