export type UserRole = "admin" | "manager" | "employee" | "viewer";

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
 * Database user type (matches public.users table)
 * Note: With Supabase Auth, authentication is handled in auth.users.
 * This table stores role and application-specific user data.
 */
export interface DbUser {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface DbUserInsert {
  id: string; // Required - must match auth.users.id
  email: string;
  role?: UserRole;
  is_active?: boolean;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface DbUserUpdate {
  email?: string;
  role?: UserRole;
  is_active?: boolean;
  last_login?: string | null;
  updated_at?: string;
  deleted_at?: string | null;
}
