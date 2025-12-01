/**
 * API Route: /api/employee
 * Delegates to feature-based handlers in features/(hr)/employees/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getEmployees,
  createEmployee,
} from "@/features/employees/api/employee.handlers";

export async function GET(request: NextRequest) {
  return getEmployees(request);
}

export async function POST(request: NextRequest) {
  return createEmployee(request);
}
