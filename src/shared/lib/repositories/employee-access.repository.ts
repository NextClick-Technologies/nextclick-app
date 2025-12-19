import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

/**
 * Shared repository for employee project access using the materialized view
 * This provides high-performance lookups for employee permissions
 * Uses user-scoped Supabase client to respect RLS policies
 */

export interface EmployeeProjectAccess {
  user_id: string;
  project_id: string;
  client_id: string | null;
  access_type: "manager" | "member";
}

/**
 * Get all projects accessible to an employee (as member or manager)
 * Uses the materialized view for optimal performance
 */
export async function getEmployeeProjectAccess(userId: string) {
  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("employee_project_access")
    .select("*")
    .eq("user_id", userId);
}

/**
 * Get project IDs accessible to an employee
 */
export async function getEmployeeProjectIds(userId: string): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employee_project_access")
    .select("project_id")
    .eq("user_id", userId);

  return (
    (data as { project_id: string }[] | null)?.map((d) => d.project_id) || []
  );
}

/**
 * Get client IDs accessible to an employee (via their projects)
 */
export async function getEmployeeClientIds(userId: string): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employee_project_access")
    .select("client_id")
    .eq("user_id", userId)
    .not("client_id", "is", null);

  return (
    (data as { client_id: string }[] | null)
      ?.map((d) => d.client_id)
      .filter((id): id is string => id !== null) || []
  );
}

/**
 * Check if employee has access to a specific project
 */
export async function hasProjectAccess(
  userId: string,
  projectId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employee_project_access")
    .select("project_id")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();

  return !!data;
}

/**
 * Check if employee is the manager of a specific project
 */
export async function isProjectManager(
  userId: string,
  projectId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employee_project_access")
    .select("access_type")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .eq("access_type", "manager")
    .maybeSingle();

  return !!data;
}
