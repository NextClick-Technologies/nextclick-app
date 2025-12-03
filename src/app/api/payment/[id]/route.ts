/**
 * API Route: /api/payment/[id]
 * Delegates to feature-based handlers in features/(finance)/payment/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getPayment,
  updatePayment,
  deletePayment,
} from "@/features/payment/api/handlers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getPayment(id, request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updatePayment(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deletePayment(id, request);
}
