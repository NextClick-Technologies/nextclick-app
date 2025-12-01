/**
 * API Route: /api/employee/[id]
 * Delegates to feature-based handlers in features/(hr)/employees/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "@/features/employees/api/employee.handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getEmployeeById(id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateEmployee(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteEmployee(id);
}
