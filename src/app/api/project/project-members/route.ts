/**
 * Delegation Route - Project Members Management
 * This file serves as a thin routing layer that delegates to the feature implementation.
 * All business logic, authentication, and audit logging are handled in the features directory.
 */
import { NextRequest } from "next/server";
import {
  getProjectMembers,
  assignUserToProject,
  removeUserFromProject,
} from "@/features/projects/api/project-members.handlers";

export async function GET(request: NextRequest) {
  return getProjectMembers(request);
}

export async function POST(request: NextRequest) {
  return assignUserToProject(request);
}

export async function DELETE(request: NextRequest) {
  return removeUserFromProject(request);
}
