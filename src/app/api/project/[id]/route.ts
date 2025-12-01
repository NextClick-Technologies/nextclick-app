/**
 * API Route: /api/project/[id]
 * Delegates to feature-based handlers in features/(crm)/projects/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/features/(crm)/projects/api/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getProjectById(id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateProject(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteProject(id);
}
