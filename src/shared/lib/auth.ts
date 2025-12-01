import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, updateUser } from "@/shared/lib/supabase/auth-client";
import { verifyPassword } from "@/shared/lib/auth/password";
import { getRolePermissions } from "@/shared/lib/auth/permissions";
import type { UserRole } from "@/shared/types/auth.types";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Query user by email from users table
        const { data: user, error } = await getUserByEmail(
          credentials.email as string
        );

        if (error || !user) {
          throw new Error("Invalid email or password");
        }

        // Check if user is active
        if (!user.is_active) {
          throw new Error(
            "Your account has been disabled. Please contact an administrator."
          );
        }

        // Check if email is verified
        if (!user.email_verified) {
          throw new Error(
            "Please verify your email address before logging in."
          );
        }

        // Verify password
        const isValid = await verifyPassword(
          credentials.password as string,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Update last login timestamp
        await updateUser(user.id, { last_login: new Date().toISOString() });

        return {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.permissions = getRolePermissions(user.role as UserRole);
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isOnApi = nextUrl.pathname.startsWith("/api");

      // Admin routes: /admin/* or /(app)/admin/*
      const isOnAdmin = nextUrl.pathname.includes("/admin");

      // App routes: any route with (app) or starting with /dashboard, /clients, /companies, etc.
      const isOnApp =
        nextUrl.pathname.includes("/(app)") ||
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/clients") ||
        nextUrl.pathname.startsWith("/companies") ||
        nextUrl.pathname.startsWith("/projects") ||
        nextUrl.pathname.startsWith("/employees") ||
        nextUrl.pathname.startsWith("/payments") ||
        nextUrl.pathname.startsWith("/communication");

      // Check if route is HR-related (employee management)
      const isOnHR = nextUrl.pathname.includes("/employees");

      // Public routes - allow access to auth pages for non-logged-in users
      if (isOnAuth) {
        if (isLoggedIn && nextUrl.pathname !== "/auth/error") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protect API routes (except auth endpoints)
      if (isOnApi && !nextUrl.pathname.startsWith("/api/auth")) {
        return isLoggedIn;
      }

      // Protect admin routes - only admins can access
      if (isOnAdmin) {
        if (!isLoggedIn) {
          const signInUrl = new URL("/auth/signin", nextUrl);
          signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(signInUrl);
        }
        if (auth.user.role !== "admin") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protect HR routes - employees and viewers cannot access
      if (isOnHR) {
        if (!isLoggedIn) {
          const signInUrl = new URL("/auth/signin", nextUrl);
          signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(signInUrl);
        }
        if (auth.user.role === "employee" || auth.user.role === "viewer") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protect all app routes - require authentication
      if (isOnApp || nextUrl.pathname === "/") {
        if (!isLoggedIn) {
          const signInUrl = new URL("/auth/signin", nextUrl);
          signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(signInUrl);
        }
        return true;
      }

      // Default: allow public access (for static files, etc.)
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
