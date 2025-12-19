export type UserRole = "admin" | "manager" | "employee" | "viewer";

export type Permission =
  | "clients:read"
  | "clients:create"
  | "clients:update"
  | "clients:delete"
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "employees:read"
  | "employees:create"
  | "employees:update"
  | "employees:delete"
  | "companies:read"
  | "companies:create"
  | "companies:update"
  | "companies:delete"
  | "payments:read"
  | "payments:create"
  | "payments:update"
  | "payments:delete"
  | "milestones:read"
  | "milestones:create"
  | "milestones:update"
  | "milestones:delete"
  | "communications:read"
  | "communications:create"
  | "communications:update"
  | "communications:delete";

/**
 * Application user interface
 * Note: Email verification is handled by Supabase Auth
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new user (admin operation)
 */
export interface CreateUserInput {
  email: string;
  role: UserRole;
  password?: string; // Optional - if not provided, a random one will be generated
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role?: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
