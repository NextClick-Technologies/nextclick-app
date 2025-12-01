/**
 * API Route: /api/milestone/[id]
 * Delegates to feature-based handlers in features/(crm)/milestone/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getMilestone,
  updateMilestone,
  deleteMilestone,
} from "@/features/(crm)/milestone/api/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getMilestone(id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateMilestone(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteMilestone(id);
}
