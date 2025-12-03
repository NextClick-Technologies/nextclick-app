/**
 * API Route: /api/company/[id]
 * Delegates to feature-based handlers in features/(crm)/companies/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "@/features/companies/api/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getCompanyById(id, request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateCompany(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteCompany(id, request);
}
