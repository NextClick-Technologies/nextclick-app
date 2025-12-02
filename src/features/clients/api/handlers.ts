/**
 * API Route Handlers for Clients
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
import * as clientService from "../domain/services";

/**
 * GET /api/client - Get all clients with pagination
 */
export async function getClients(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, pageSize } = parsePagination(searchParams);
    const orderByParam = searchParams.get("orderBy");
    const genderFilter = searchParams.get("gender");

    const result = await clientService.getClients({
      page,
      pageSize,
      orderBy: parseOrderBy(orderByParam),
      filters: { gender: genderFilter || undefined },
    });

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
 */
export async function createClient(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await clientService.createClient(body);
    return apiSuccess(data, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/client/[id] - Get a single client by ID
 */
export async function getClientById(id: string) {
  try {
    const data = await clientService.getClientById(id);
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
 */
export async function updateClient(id: string, request: NextRequest) {
  try {
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
 */
export async function deleteClient(id: string) {
  try {
    await clientService.deleteClient(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Client not found") {
      return apiError("Client not found", 404);
    }
    return handleApiError(error);
  }
}
