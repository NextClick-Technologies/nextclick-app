// Delegate to auth feature handlers
import { verifyEmailHandler } from "@/features/auth/api/verify-email.handler";

export const POST = verifyEmailHandler;
