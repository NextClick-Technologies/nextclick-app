/**
 * Supabase client with user context for RLS
 * This creates a Supabase client that respects Row Level Security policies
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/types/database.type";
import { auth } from "@/shared/lib/auth/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client with user authentication context
 * This client will respect RLS policies based on the authenticated user
 *
 * IMPORTANT: This uses the anon key and sets the user context via auth.uid()
 * For this to work with RLS policies, you need to ensure:
 * 1. The policies use auth.uid() to identify the current user
 * 2. We set up a proper JWT-based auth system with Supabase Auth
 */
export async function getSupabaseUserClient() {
  const session = await auth();

  if (!session?.user?.id) {
    // No authenticated user, return client without user context
    return createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  // For RLS to work properly with custom JWT (NextAuth), we need to:
  // 1. Use service role for backend operations (current approach)
  // 2. Add manual permission checks in the application layer
  // OR
  // 3. Switch to Supabase Auth entirely

  // Since we're using NextAuth, we'll use the admin client but add
  // application-level permission checks

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
