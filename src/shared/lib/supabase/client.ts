"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/shared/types/database.type";

/**
 * Create a Supabase client for browser/client-side operations
 * This client respects RLS policies based on the authenticated user's session
 *
 * Use this in client components for database operations and auth state management
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
