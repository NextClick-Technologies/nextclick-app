/**
 * API Route: /api/company
 * Delegates to feature-based handlers in features/(crm)/companies/api/handlers.ts
 */
import { NextRequest } from "next/server";
import { getCompanies, createCompany } from "@/features/companies/api/handlers";

export async function GET(request: NextRequest) {
  return getCompanies(request);
}

export async function POST(request: NextRequest) {
  return createCompany(request);
}
