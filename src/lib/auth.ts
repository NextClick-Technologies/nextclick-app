import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, updateUser } from "@/lib/supabase/auth-client";
import { verifyPassword } from "@/lib/auth/password";
import { getRolePermissions } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/auth.types";

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
        const { data: user, error } = await getUserByEmail(credentials.email as string);

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
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnApp =
        nextUrl.pathname.startsWith("/app") ||
        nextUrl.pathname.startsWith("/dashboard");

      // Check if route is HR-related (employee management)
      const isOnHR = nextUrl.pathname.match(
        /\/(app\/)?(\(app\)\/)?(\(hr\)|employees)/
      );

      // Public routes - allow access to auth pages for non-logged-in users
      if (isOnAuth && nextUrl.pathname !== "/auth/error") {
        if (isLoggedIn) {
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
        if (!isLoggedIn) return false;
        if (auth.user.role !== "admin") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Protect HR routes - employees and viewers cannot access
      if (isOnHR) {
        if (!isLoggedIn) return false;
        if (auth.user.role === "employee" || auth.user.role === "viewer") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // Require auth for all app routes
      if (isOnApp || nextUrl.pathname === "/") {
        if (!isLoggedIn) {
          return false;
        }
        return true;
      }

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
