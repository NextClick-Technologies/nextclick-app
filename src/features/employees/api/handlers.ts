/**
 * API Route Handlers for Employees
 * Thin layer that handles HTTP requests/responses and delegates to service layer
 */
import { NextRequest, NextResponse } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  parsePagination,
  parseOrderBy,
  buildPaginatedResponse,
} from "@/shared/lib/api/api-utils";
import {
  requireAdmin,
  requireAdminOrManager,
} from "@/shared/lib/api/auth-middleware";
import * as employeeService from "../domain/services";

/**
 * GET /api/employee - Get all employees with pagination
 * Permissions: Admin and Manager can read (for selecting project managers and team members)
 */
export async function getEmployees(request: NextRequest) {
  try {
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");

    const result = await employeeService.getEmployees({
      page,
      pageSize,
      orderBy: parseOrderBy(orderByParam),
    });

    return apiSuccess(
      buildPaginatedResponse(result.employees, page, pageSize, result.count)
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/employee - Create a new employee
 */
export async function createEmployee(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const data = await employeeService.createEmployee(body);
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/employee/[id] - Get a single employee by ID
 * Permissions: Admin and Manager can read
 */
export async function getEmployeeById(id: string, request: NextRequest) {
  try {
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    const data = await employeeService.getEmployeeById(id);
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Employee not found") {
      return apiError("Employee not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * PATCH /api/employee/[id] - Update an employee
 */
export async function updateEmployee(id: string, request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const data = await employeeService.updateEmployee(id, body);
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Employee not found") {
      return apiError("Employee not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/employee/[id] - Delete an employee
 */
export async function deleteEmployee(id: string, request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    await employeeService.deleteEmployee(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Employee not found") {
      return apiError("Employee not found", 404);
    }
    return handleApiError(error);
  }
}
