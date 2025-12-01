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

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role: UserRole;
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
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetSubmit {
  token: string;
  newPassword: string;
}

export interface EmailVerification {
  token: string;
}
