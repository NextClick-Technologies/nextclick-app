/**
 * API Permission Middleware
 * Enforces role-based access control at the API level
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth/auth";
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
 * Returns null if authenticated, error response if not
 */
export async function requireAuth(request: NextRequest): Promise<
  | {
      userId: string;
      userRole: UserRole;
      userEmail: string;
    }
  | NextResponse
> {
  const session = await auth();

  if (!session?.user) {
    return apiError("Unauthorized - Please sign in", 401);
  }

  return {
    userId: session.user.id,
    userRole: session.user.role,
    userEmail: session.user.email || "",
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
