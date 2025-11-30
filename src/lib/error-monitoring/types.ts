export enum ErrorSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NOISE = 'noise',
}

export interface ErrorContext {
  source: 'api' | 'client' | 'database';
  url?: string;
  method?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  statusCode?: number;
  metadata?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  created_at: string;
  error_hash: string;
  severity: ErrorSeverity;
  error_type: string;
  message: string;
  stack_trace?: string;
  environment?: string;
  source: string;
  url?: string;
  method?: string;
  user_id?: string;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  request_headers?: Record<string, any>;
  request_body?: Record<string, any>;
  occurrence_count: number;
  first_seen: string;
  last_seen: string;
  jira_issue_key?: string;
  discord_message_id?: string;
}
