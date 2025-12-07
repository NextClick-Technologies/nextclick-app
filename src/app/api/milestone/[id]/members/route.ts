/**
 * API Route: /api/milestone/[id]/members
 * Delegates to feature-based handlers in features/milestone/api/milestones.handlers.ts
 */
import { NextRequest } from "next/server";
import {
  addMilestoneMember,
  removeMilestoneMember,
} from "@/features/milestone/api/milestone-members.handlers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return addMilestoneMember(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return removeMilestoneMember(request, { params });
}
