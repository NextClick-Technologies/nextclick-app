/**
 * UI Permission Hook
 * Provides permission checks for UI components
 */
"use client";

import { useAuth } from "@/shared/contexts/AuthContext";
import type { Permission } from "@/shared/types/auth.types";

export function usePermissions() {
  const { user, can, canAccess, hasRole, isAdmin, isManager } = useAuth();

  /**
   * Check if user can perform action on a resource
   * @param resource - Resource name (e.g., 'clients', 'projects')
   * @param action - Action type ('create', 'read', 'update', 'delete')
   */
  const canDo = (
    resource: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    return canAccess(resource, action);
  };

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    return can(permission);
  };

  /**
   * Check if user can create a resource
   */
  const canCreate = (resource: string): boolean => {
    return canDo(resource, "create");
  };

  /**
   * Check if user can read a resource
   */
  const canRead = (resource: string): boolean => {
    return canDo(resource, "read");
  };

  /**
   * Check if user can update a resource
   */
  const canUpdate = (resource: string): boolean => {
    return canDo(resource, "update");
  };

  /**
   * Check if user can delete a resource
   */
  const canDelete = (resource: string): boolean => {
    return canDo(resource, "delete");
  };

  /**
   * Check if user is admin or manager
   */
  const canManage = (): boolean => {
    return isAdmin || isManager;
  };

  return {
    user,
    can: hasPermission,
    canDo,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canManage,
    isAdmin,
    isManager,
    hasRole,
  };
}
