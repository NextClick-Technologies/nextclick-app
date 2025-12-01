import type { UserRole, Permission } from "@/types/auth.types";

/**
 * Role-based permission mapping
 * Defines what actions each role can perform
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    // Full access to everything
    "clients:read",
    "clients:create",
    "clients:update",
    "clients:delete",
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
    "employees:read",
    "employees:create",
    "employees:update",
    "employees:delete",
    "companies:read",
    "companies:create",
    "companies:update",
    "companies:delete",
    "payments:read",
    "payments:create",
    "payments:update",
    "payments:delete",
    "milestones:read",
    "milestones:create",
    "milestones:update",
    "milestones:delete",
    "communications:read",
    "communications:create",
    "communications:update",
    "communications:delete",
  ],
  manager: [
    // Can manage clients, projects, companies (NO employees)
    "clients:read",
    "clients:create",
    "clients:update",
    "clients:delete",
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
    "companies:read",
    "companies:create",
    "companies:update",
    "companies:delete",
    "payments:read",
    "payments:create",
    "payments:update",
    "payments:delete",
    "milestones:read",
    "milestones:create",
    "milestones:update",
    "milestones:delete",
    "communications:read",
    "communications:create",
    "communications:update",
    "communications:delete",
  ],
  employee: [
    // Can view assigned projects and related data only
    "projects:read",
    "clients:read",
    "companies:read",
    "payments:read",
    "milestones:read",
    "communications:read",
  ],
  viewer: [
    // Read-only access
    "clients:read",
    "projects:read",
    "companies:read",
    "payments:read",
    "milestones:read",
    "communications:read",
  ],
};

/**
 * Get all permissions for a given role
 * @param role - User role
 * @returns Array of permissions
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission
 * @param userRole - User role
 * @param permission - Permission to check
 * @returns True if role has permission
 */
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

/**
 * Check if a role can access a resource with a specific action
 * @param userRole - User role
 * @param resource - Resource name (e.g., 'clients', 'projects')
 * @param action - Action type
 * @returns True if role can perform action on resource
 */
export function canAccessResource(
  userRole: UserRole,
  resource: string,
  action: "read" | "create" | "update" | "delete"
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(userRole, permission);
}

/**
 * Check if user has any of the specified roles
 * @param userRole - Current user role
 * @param allowedRoles - Array of allowed roles
 * @returns True if user has any of the allowed roles
 */
export function hasAnyRole(
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is admin
 * @param userRole - User role
 * @returns True if user is admin
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === "admin";
}

/**
 * Check if user is admin or manager
 * @param userRole - User role
 * @returns True if user is admin or manager
 */
export function isAdminOrManager(userRole: UserRole): boolean {
  return userRole === "admin" || userRole === "manager";
}

/**
 * Check if user can manage employees (admin only)
 * @param userRole - User role
 * @returns True if user can manage employees
 */
export function canManageEmployees(userRole: UserRole): boolean {
  return userRole === "admin";
}

/**
 * Check if user can only view data (viewer or employee without assigned projects)
 * @param userRole - User role
 * @returns True if user is viewer
 */
export function isReadOnly(userRole: UserRole): boolean {
  return userRole === "viewer";
}

/**
 * Get resource permissions for a role
 * @param userRole - User role
 * @param resource - Resource name
 * @returns Object with read, create, update, delete permissions
 */
export function getResourcePermissions(
  userRole: UserRole,
  resource: string
): {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
} {
  return {
    read: canAccessResource(userRole, resource, "read"),
    create: canAccessResource(userRole, resource, "create"),
    update: canAccessResource(userRole, resource, "update"),
    delete: canAccessResource(userRole, resource, "delete"),
  };
}
