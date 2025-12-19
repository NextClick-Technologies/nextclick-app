/**
 * API Permission Middleware
 * Enforces role-based access control at the API level using Supabase Auth
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import {
  hasPermission,
  isAdmin,
  isAdminOrManager,
} from "@/shared/lib/auth/permissions";
import type { Permission, UserRole } from "@/shared/types/auth.types";
import { apiError } from "./api-utils";

export interface AuthenticatedRequest extends NextRequest {
  auth: {
    userId: string;
    userRole: UserRole;
    userEmail: string;
  };
}

/**
 * Require authentication for API route
 * Returns user info if authenticated, error response if not
 */
export async function requireAuth(request: NextRequest): Promise<
  | {
      userId: string;
      userRole: UserRole;
      userEmail: string;
    }
  | NextResponse
> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return apiError("Unauthorized - Please sign in", 401);
  }

  // Get user role from public.users
  const { data: userData } = await supabase
    .from("users")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!userData) {
    return apiError("User profile not found", 404);
  }

  const userRecord = userData as { role: string; is_active: boolean };

  if (!userRecord.is_active) {
    return apiError(
      "Your account has been deactivated. Please contact an administrator.",
      403
    );
  }

  return {
    userId: user.id,
    userRole: userRecord.role as UserRole,
    userEmail: user.email || "",
  };
}

/**
 * Require specific permission for API route
 */
export async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<
  | {
      userId: string;
      userRole: UserRole;
      userEmail: string;
    }
  | NextResponse
> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  if (!hasPermission(authResult.userRole, permission)) {
    return apiError(
      `Forbidden - You don't have permission to ${permission}`,
      403
    );
  }

  return authResult;
}

/**
 * Require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<
  | {
      userId: string;
      userRole: UserRole;
      userEmail: string;
    }
  | NextResponse
> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!isAdmin(authResult.userRole)) {
    return apiError("Forbidden - Admin access required", 403);
  }

  return authResult;
}

/**
 * Require admin or manager role
 */
export async function requireAdminOrManager(request: NextRequest): Promise<
  | {
      userId: string;
      userRole: UserRole;
      userEmail: string;
    }
  | NextResponse
> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!isAdminOrManager(authResult.userRole)) {
    return apiError("Forbidden - Admin or Manager access required", 403);
  }

  return authResult;
}

/**
 * Require one of multiple roles
 */
export async function requireRoles(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<
  | {
      userId: string;
      userRole: UserRole;
      userEmail: string;
    }
  | NextResponse
> {
  const authResult = await requireAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.userRole)) {
    return apiError(
      `Forbidden - Requires one of: ${allowedRoles.join(", ")}`,
      403
    );
  }

  return authResult;
}
