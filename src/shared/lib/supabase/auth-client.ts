/**
 * Type-safe Supabase client helpers for auth tables
 * This file provides properly typed functions for interacting with auth-related tables
 */

import { supabaseAdmin } from "./server";
import type {
  UserDB,
  UserInsert,
  UserUpdate,
  AuditLogInsert,
  ProjectMemberInsert,
} from "@/types/database.type";

/**
 * Get a user by ID
 */
export async function getUserById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data as UserDB | null, error };
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  return { data: data as UserDB | null, error };
}

/**
 * Get a user by email verification token
 */
export async function getUserByVerificationToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email_verification_token", token)
    .maybeSingle();

  return { data: data as UserDB | null, error };
}

/**
 * Get a user by password reset token
 */
export async function getUserByResetToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("password_reset_token", token)
    .maybeSingle();

  return { data: data as UserDB | null, error };
}

/**
 * Create a new user
 */
export async function createUser(user: UserInsert) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert(user as unknown as never)
    .select("*")
    .single();

  return { data: data as UserDB | null, error };
}

/**
 * Update a user
 */
export async function updateUser(id: string, updates: UserUpdate) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(updates as unknown as never)
    .eq("id", id)
    .select("*")
    .single();

  return { data: data as UserDB | null, error };
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(log: AuditLogInsert) {
  const { error } = await supabaseAdmin
    .from("audit_logs")
    .insert(log as unknown as never);

  return { error };
}

/**
 * Create a project member
 */
export async function createProjectMember(member: ProjectMemberInsert) {
  const { data, error } = await supabaseAdmin
    .from("project_members")
    .insert(member as unknown as never)
    .select("*")
    .single();

  return { data, error };
}

/**
 * Delete a project member
 */
export async function deleteProjectMember(id: string) {
  const { error } = await supabaseAdmin
    .from("project_members")
    .delete()
    .eq("id", id);

  return { error };
}
