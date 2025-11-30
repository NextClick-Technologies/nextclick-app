import { createClient } from '@supabase/supabase-js';
import type { ErrorLog } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function logToSupabase(
  errorData: Omit<ErrorLog, 'id' | 'created_at' | 'first_seen' | 'last_seen' | 'occurrence_count'>
): Promise<ErrorLog> {
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
  const { data } = await supabase
    .rpc('get_recent_error_by_hash', { hash: errorHash });

  return data?.[0] || null;
}

export async function updateOccurrence(errorId: string): Promise<void> {
  await supabase.rpc('increment_error_occurrence', { error_id: errorId });
}

export async function updateJiraLink(errorId: string, jiraIssueKey: string): Promise<void> {
  await supabase
    .from('error_logs')
    .update({ jira_issue_key: jiraIssueKey })
    .eq('id', errorId);
}

export async function updateDiscordLink(errorId: string, discordMessageId: string): Promise<void> {
  await supabase
    .from('error_logs')
    .update({ discord_message_id: discordMessageId })
    .eq('id', errorId);
}
