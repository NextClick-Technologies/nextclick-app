/**
 * API Route Handlers for Companies
 * Thin layer that handles HTTP requests/responses and delegates to service layer
 */
import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
} from "@/shared/lib/api/api-utils";
import * as companyService from "../domain/services/service";

/**
 * GET /api/company - Get all companies with pagination
 */
export async function getCompanies(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");

    const result = await companyService.getCompanies({
      page,
      pageSize,
      orderBy: parseOrderBy(orderByParam),
    });

    return apiSuccess(
      buildPaginatedResponse(result.companies, page, pageSize, result.count)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/company - Create a new company
 */
export async function createCompany(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await companyService.createCompany(body);
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/company/[id] - Get a single company by ID
 */
export async function getCompanyById(id: string) {
  try {
    const data = await companyService.getCompanyById(id);
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Company not found") {
      return apiError("Company not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * PATCH /api/company/[id] - Update a company
 */
export async function updateCompany(id: string, request: NextRequest) {
  try {
    const body = await request.json();
    const data = await companyService.updateCompany(id, body);
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Company not found") {
      return apiError("Company not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/company/[id] - Delete a company
 */
export async function deleteCompany(id: string) {
  try {
    await companyService.deleteCompany(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Company not found") {
      return apiError("Company not found", 404);
    }
    return handleApiError(error);
  }
}
