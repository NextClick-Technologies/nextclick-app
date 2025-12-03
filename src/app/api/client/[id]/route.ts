/**
 * API Route: /api/client/[id]
 * Delegates to feature-based handlers in features/(crm)/clients/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getClientById,
  updateClient,
  deleteClient,
} from "@/features/clients/api/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getClientById(id, request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateClient(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteClient(id, request);
}
