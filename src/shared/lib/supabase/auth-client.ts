/**
 * Type-safe Supabase client helpers for auth-related tables
 * This file provides properly typed functions for interacting with user data
 *
 * Note: With Supabase Auth, authentication is handled by the auth.users table.
 * The public.users table stores role and application-specific user data.
 */

import { createSupabaseServerClient, supabaseAdmin } from "./server";
import type {
  UserDB,
  UserUpdate,
  AuditLogInsert,
  ProjectMemberInsert,
} from "@/shared/types/database.type";

/**
 * Get a user by ID from public.users (includes role info)
 * Uses user-scoped client to respect RLS
 */
export async function getUserById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data as UserDB | null, error };
}

/**
 * Get a user by email from public.users
 * Uses user-scoped client to respect RLS
 */
export async function getUserByEmail(email: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  return { data: data as UserDB | null, error };
}

/**
 * Update a user in public.users
 * Uses user-scoped client to respect RLS (users can only update their own data, admins can update all)
 */
export async function updateUser(id: string, updates: UserUpdate) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() } as never)
    .eq("id", id)
    .select("*")
    .single();

  return { data: data as UserDB | null, error };
}

/**
 * Update user role (admin only)
 * Uses admin client since this bypasses normal RLS for admin operations
 */
export async function updateUserRole(
  id: string,
  role: "admin" | "manager" | "employee" | "viewer"
) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ role, updated_at: new Date().toISOString() } as never)
    .eq("id", id)
    .select("*")
    .single();

  return { data: data as UserDB | null, error };
}

/**
 * Create an audit log entry
 * Uses admin client since audit logs should always be writable
 */
export async function createAuditLog(log: AuditLogInsert) {
  const { error } = await supabaseAdmin
    .from("audit_logs")
    .insert(log as unknown as never);

  return { error };
}

/**
 * Create a project member
 * Uses user-scoped client to respect RLS
 */
export async function createProjectMember(member: ProjectMemberInsert) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("project_members")
    .insert(member as unknown as never)
    .select("*")
    .single();

  return { data, error };
}

/**
 * Delete a project member (soft delete)
 * Uses user-scoped client to respect RLS
 */
export async function deleteProjectMember(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("project_members")
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq("id", id)
    .is("deleted_at", null);

  return { error };
}
