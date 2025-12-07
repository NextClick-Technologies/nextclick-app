/**
 * API Route: /api/milestone
 * Delegates to feature-based handlers in features/milestone/api/milestones.handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getMilestones,
  createMilestone,
} from "@/features/milestone/api/milestones.handlers";

export async function GET(request: NextRequest) {
  return getMilestones(request);
}

export async function POST(request: NextRequest) {
  return createMilestone(request);
}
