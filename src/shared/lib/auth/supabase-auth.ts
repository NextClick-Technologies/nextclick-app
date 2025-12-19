/**
 * Supabase Auth Helper Functions
 * Server-side utilities for authentication and user management
 */

import {
  createSupabaseServerClient,
  supabaseAdmin,
} from "@/shared/lib/supabase/server";
import type { UserRole } from "@/shared/types/auth.types";
import type { User } from "@supabase/supabase-js";

export interface UserWithRole extends User {
  role: UserRole;
  isActive: boolean;
}

/**
 * Get the current session from Supabase Auth
 * Returns null if no valid session exists
 */
export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current authenticated user from Supabase Auth
 * This validates the session with the Supabase server
 * Returns null if no valid user exists
 */
export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the current user with their role from public.users
 * Returns null if no valid user exists or if user not found in public.users
 */
export async function getUserWithRole(): Promise<UserWithRole | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase
    .from("users")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!userData) return null;

  const userRecord = userData as { role: string; is_active: boolean };

  return {
    ...user,
    role: userRecord.role as UserRole,
    isActive: userRecord.is_active,
  };
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getUserWithRole();
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Check if the current user is an admin or manager
 */
export async function isAdminOrManager(): Promise<boolean> {
  const user = await getUserWithRole();
  if (!user) return false;
  return user.role === "admin" || user.role === "manager";
}

// ==================== Admin Operations ====================

/**
 * Create a new user with Supabase Auth (Admin only)
 * This creates a user in auth.users, and the trigger will create the public.users record
 *
 * @param email - User's email address
 * @param password - Initial password (user should change on first login)
 * @param role - User's role in the application
 * @param emailConfirm - Whether to auto-confirm the email (default: true for admin-created users)
 */
export async function createUserWithRole(
  email: string,
  password: string,
  role: UserRole,
  emailConfirm: boolean = true
) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: emailConfirm,
    user_metadata: { role },
  });

  return { user: data?.user || null, error };
}

/**
 * Update a user's role (Admin only)
 * Updates the role in public.users table
 */
export async function updateUserRole(userId: string, newRole: UserRole) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ role: newRole, updated_at: new Date().toISOString() } as never)
    .eq("id", userId)
    .select()
    .single();

  return { user: data, error };
}

/**
 * Deactivate a user account (Admin only)
 * Sets is_active to false in public.users
 */
export async function deactivateUser(userId: string) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({ is_active: false, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return { error };
}

/**
 * Activate a user account (Admin only)
 * Sets is_active to true in public.users
 */
export async function activateUser(userId: string) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({ is_active: true, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return { error };
}

/**
 * Delete a user account (Admin only)
 * This deletes from auth.users, and the trigger will soft-delete from public.users
 */
export async function deleteUser(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return { error };
}

/**
 * Send password reset email to a user
 * Uses Supabase Auth's built-in password reset functionality
 */
export async function sendPasswordResetEmail(email: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  return { error };
}

/**
 * Update user's password using reset token
 * This should be called after user clicks the reset link
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { error };
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("users")
    .update({ last_login: new Date().toISOString() } as never)
    .eq("id", userId);

  return { error };
}
