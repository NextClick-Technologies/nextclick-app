/**
 * API Route Handlers for Clients
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
  requirePermission,
  requireAdminOrManager,
} from "@/shared/lib/api/auth-middleware";
import * as clientService from "../domain/services";

/**
 * GET /api/client - Get all clients with pagination
 * Permissions: All authenticated users can read (filtered by role in service layer)
 */
export async function getClients(request: NextRequest) {
  try {
    // Require clients:read permission
    const authResult = await requirePermission(request, "clients:read");
    if (authResult instanceof NextResponse) return authResult;

    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const genderFilter = searchParams.get("gender");

    const result = await clientService.getClients(
      {
        page,
        pageSize,
        orderBy: parseOrderBy(orderByParam),
        filters: { gender: genderFilter || undefined },
      },
      authResult.userId,
      authResult.userRole
    );

    return apiSuccess(
      buildPaginatedResponse(
        result.clients,
        page,
        pageSize,
        result.count,
        result.metadata
      )
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/client - Create a new client
 * Permissions: Admin and Manager only
 */
export async function createClient(request: NextRequest) {
  try {
    // Require admin or manager role
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const data = await clientService.createClient(body);
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/client/[id] - Get a single client by ID
 * Permissions: All authenticated users (filtered by role)
 */
export async function getClientById(id: string, request: NextRequest) {
  try {
    // Require clients:read permission
    const authResult = await requirePermission(request, "clients:read");
    if (authResult instanceof NextResponse) return authResult;

    const data = await clientService.getClientById(
      id,
      authResult.userId,
      authResult.userRole
    );
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return apiError("Client not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * PATCH /api/client/[id] - Update a client
 * Permissions: Admin and Manager only
 */
export async function updateClient(id: string, request: NextRequest) {
  try {
    // Require admin or manager role
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    const body = await request.json();
    const data = await clientService.updateClient(id, body);
    return apiSuccess({ data });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return apiError("Client not found", 404);
    }
    return handleApiError(error);
  }
}

/**
 * DELETE /api/client/[id] - Delete a client
 * Permissions: Admin and Manager only
 */
export async function deleteClient(id: string, request: NextRequest) {
  try {
    // Require admin or manager role
    const authResult = await requireAdminOrManager(request);
    if (authResult instanceof NextResponse) return authResult;

    await clientService.deleteClient(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return apiError("Client not found", 404);
    }
    return handleApiError(error);
  }
}
