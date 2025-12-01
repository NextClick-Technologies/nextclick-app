import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ErrorLog } from './types';

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create Supabase client (lazy initialization)
 * Only works on server-side
 */
function getSupabaseClient() {
  // Don't initialize on client side
  if (typeof window !== 'undefined') {
    throw new Error('Supabase error logging should only be used on server-side');
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
    }

    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }

  return supabaseClient;
}

export async function logToSupabase(
  errorData: Omit<ErrorLog, 'id' | 'created_at' | 'first_seen' | 'last_seen' | 'occurrence_count'>
): Promise<ErrorLog> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('error_logs')
    .insert({
      ...errorData,
      environment: process.env.ERROR_MONITORING_ENVIRONMENT || process.env.NODE_ENV,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to log error to Supabase:', error);
    throw error;
  }

  return data;
}

export async function checkDuplicate(errorHash: string): Promise<ErrorLog | null> {
  const supabase = getSupabaseClient();
  
  const { data } = await supabase
    .rpc('get_recent_error_by_hash', { hash: errorHash });

  return data?.[0] || null;
}

export async function updateOccurrence(errorId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.rpc('increment_error_occurrence', { error_id: errorId });
}

export async function updateJiraLink(errorId: string, jiraIssueKey: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase
    .from('error_logs')
    .update({ jira_issue_key: jiraIssueKey })
    .eq('id', errorId);
}

export async function updateDiscordLink(errorId: string, discordMessageId: string): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase
    .from('error_logs')
    .update({ discord_message_id: discordMessageId })
    .eq('id', errorId);
}
