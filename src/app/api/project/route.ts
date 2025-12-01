/**
 * API Route: /api/project
 * Delegates to feature-based handlers in features/(crm)/projects/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getProjects,
  createProject,
} from "@/features/projects/api/projects.handlers";

export async function GET(request: NextRequest) {
  return getProjects(request);
}

export async function POST(request: NextRequest) {
  return createProject(request);
}
