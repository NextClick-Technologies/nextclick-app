// Delegate to auth feature handlers
import { createUserHandler } from "@/features/auth/api/create-user.handler";

export const POST = createUserHandler;
