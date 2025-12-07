/**
 * API Route: /api/milestone/[id]
 * Delegates to feature-based handlers in features/milestone/api/milestones.handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getMilestone,
  updateMilestone,
  deleteMilestone,
} from "@/features/milestone/api/milestones.handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return getMilestone(request, { params });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return updateMilestone(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return deleteMilestone(request, { params });
}
