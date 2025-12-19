import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/shared/types/database.type";

/**
 * Create a user-scoped Supabase client for server-side operations
 * This client respects RLS policies based on the authenticated user's session
 *
 * Use this for most database operations to ensure proper access control
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component - ignore
            // The `setAll` method is called from a Server Component
            // This can be ignored if you have middleware refreshing user sessions
          }
        },
      },
    }
  );
}

/**
 * Admin Supabase client that bypasses RLS
 * ONLY use this for:
 * - Creating new users (admin operation)
 * - System-level operations
 * - Background jobs
 *
 * WARNING: This client bypasses all Row Level Security policies
 */
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
