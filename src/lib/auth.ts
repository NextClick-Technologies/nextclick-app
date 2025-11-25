import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Employee } from "@/types";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Query employee by email
        const { data: employee } = await supabaseAdmin
          .from("employees")
          .select("*")
          .eq("email", credentials.email as string)
          .single<Employee>();

        if (!employee) {
          return null;
        }

        // In production, verify password hash here
        // For now, return employee data
        return {
          id: employee.id,
          email: employee.email,
          name: `${employee.name} ${employee.familyName}`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnApi = nextUrl.pathname.startsWith("/api");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      // Protect API routes
      if (isOnApi && !isOnAuth) {
        return isLoggedIn;
      }

      // Protect dashboard routes
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
