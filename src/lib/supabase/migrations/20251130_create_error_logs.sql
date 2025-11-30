-- Migration: Create error_logs table for error monitoring system
-- Date: 2025-11-30
-- Description: Creates table to store application errors for monitoring and analytics

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Error identification
  error_hash TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'noise')),
  error_type TEXT NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  
  -- Context
  environment TEXT CHECK (environment IN ('production', 'staging', 'development')),
  source TEXT NOT NULL CHECK (source IN ('api', 'client', 'database')),
  url TEXT,
  method TEXT,
  user_id UUID,
  session_id TEXT,
  
  -- Request details
  user_agent TEXT,
  ip_address TEXT,
  request_headers JSONB,
  request_body JSONB,
  
  -- Occurrence tracking
  occurrence_count INTEGER DEFAULT 1 NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- External ticketing
  jira_issue_key TEXT,
  discord_message_id TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_error_logs_hash ON error_logs(error_hash);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_jira ON error_logs(jira_issue_key) WHERE jira_issue_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_error_logs_source ON error_logs(source);
CREATE INDEX IF NOT EXISTS idx_error_logs_environment ON error_logs(environment);

-- Create view for error statistics (last 24 hours)
CREATE OR REPLACE VIEW error_stats_24h AS
SELECT 
  severity,
  source,
  COUNT(*) as total_errors,
  SUM(occurrence_count) as total_occurrences,
  COUNT(DISTINCT error_hash) as unique_errors,
  MAX(created_at) as last_error_at
FROM error_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY severity, source
ORDER BY 
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    WHEN 'noise' THEN 5
  END,
  total_occurrences DESC;

-- Create view for recent critical errors
CREATE OR REPLACE VIEW recent_critical_errors AS
SELECT 
  id,
  created_at,
  severity,
  error_type,
  message,
  source,
  url,
  occurrence_count,
  jira_issue_key
FROM error_logs
WHERE severity IN ('critical', 'high')
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;

-- Create function to get error by hash (for deduplication)
CREATE OR REPLACE FUNCTION get_recent_error_by_hash(hash TEXT)
RETURNS SETOF error_logs AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM error_logs
  WHERE error_hash = hash
    AND last_seen > NOW() - INTERVAL '1 hour'
  ORDER BY last_seen DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment error occurrence
CREATE OR REPLACE FUNCTION increment_error_occurrence(error_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE error_logs
  SET 
    occurrence_count = occurrence_count + 1,
    last_seen = NOW()
  WHERE id = error_id;
END;
$$ LANGUAGE plpgsql;

-- Add comment to table
COMMENT ON TABLE error_logs IS 'Stores application errors for monitoring and analytics';
COMMENT ON COLUMN error_logs.error_hash IS 'Hash of error type + message + stack trace for deduplication';
COMMENT ON COLUMN error_logs.severity IS 'Error severity: critical, high, medium, low, or noise';
COMMENT ON COLUMN error_logs.source IS 'Error source: api, client, or database';
COMMENT ON COLUMN error_logs.jira_issue_key IS 'Linked Jira ticket key (e.g., EM-123)';
COMMENT ON COLUMN error_logs.occurrence_count IS 'Number of times this error has occurred (with same hash)';

-- Grant permissions (adjust based on your RLS policies)
-- ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policy (uncomment and adjust as needed)
-- CREATE POLICY "Only admins can view error logs"
--   ON error_logs FOR SELECT
--   USING (auth.jwt() ->> 'role' = 'admin');
