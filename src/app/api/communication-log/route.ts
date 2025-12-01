/**
 * API Route: /api/communication-log
 * Delegates to feature-based handlers in features/(crm)/communication-log/api/handlers.ts
 */
import { NextRequest } from "next/server";
import {
  getCommunicationLogs,
  createCommunicationLog,
} from "@/features/(crm)/communication-log/api/handlers";

export async function GET(request: NextRequest) {
  return getCommunicationLogs(request);
}

export async function POST(request: NextRequest) {
  return createCommunicationLog(request);
}
