import { DefaultSession } from "next-auth";
import type { UserRole } from "./auth.types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    permissions: string[];
  }
}
