export type UserRole = "admin" | "manager" | "employee" | "viewer";

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

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  email_verification_token: string | null;
  email_verification_expires: string | null;
  password_reset_token: string | null;
  password_reset_expires: string | null;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUserInsert {
  id?: string;
  email: string;
  password_hash: string;
  role?: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
  email_verification_token?: string | null;
  email_verification_expires?: string | null;
  password_reset_token?: string | null;
  password_reset_expires?: string | null;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DbUserUpdate {
  id?: string;
  email?: string;
  password_hash?: string;
  role?: UserRole;
  is_active?: boolean;
  email_verified?: boolean;
  email_verification_token?: string | null;
  email_verification_expires?: string | null;
  password_reset_token?: string | null;
  password_reset_expires?: string | null;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}
