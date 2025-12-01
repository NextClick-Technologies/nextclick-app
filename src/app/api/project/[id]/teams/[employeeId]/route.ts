/**
 * Delegation Route - Remove Project Member
 * This file serves as a thin routing layer that delegates to the feature implementation.
 * All business logic is handled in the features directory.
 */
import { NextRequest } from "next/server";
import { removeProjectTeamMember } from "@/features/projects/api/projects.handlers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> }
) {
  const { id, employeeId } = await params;
  return removeProjectTeamMember(id, employeeId);
}
