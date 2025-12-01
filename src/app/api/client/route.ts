/**
 * API Route: /api/client
 * Delegates to feature-based handlers in features/(crm)/clients/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getClients,
  createClient,
} from "@/features/(crm)/clients/api/handlers";

export async function GET(request: NextRequest) {
  return getClients(request);
}

export async function POST(request: NextRequest) {
  return createClient(request);
}
