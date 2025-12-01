/**
 * API Route: /api/communication-log/[id]
 * Delegates to feature-based handlers in features/(crm)/communication-log/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getCommunicationLog,
  updateCommunicationLog,
  deleteCommunicationLog,
} from "@/features/(crm)/communication-log/api/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getCommunicationLog(id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateCommunicationLog(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteCommunicationLog(id);
}
