/**
 * Delegation Route - Project Members
 * This file serves as a thin routing layer that delegates to the feature implementation.
 * All business logic is handled in the features directory.
 */
import { NextRequest } from "next/server";
import { addProjectTeamMember } from "@/features/projects/api/projects.handlers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return addProjectTeamMember(id, request);
}
