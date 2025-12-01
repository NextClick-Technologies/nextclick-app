/**
 * API Route: /api/payment
 * Delegates to feature-based handlers in features/(finance)/payment/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getPayments,
  createPayment,
} from "@/features/(finance)/payment/api/handlers";

export async function GET(request: NextRequest) {
  return getPayments(request);
}

export async function POST(request: NextRequest) {
  return createPayment(request);
}
