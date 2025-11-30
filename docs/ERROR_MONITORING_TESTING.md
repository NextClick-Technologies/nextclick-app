# Error Monitoring Testing Guide

## Prerequisites

Make sure these environment variables are set in `.env.local`:

```bash
# Enable error monitoring
ENABLE_ERROR_MONITORING=true
ERROR_MONITORING_ENVIRONMENT=production

# Discord webhooks
DISCORD_WEBHOOK_CRITICAL=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_HIGH=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_MEDIUM=https://discord.com/api/webhooks/...

# Jira credentials
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=EM

# Supabase (already exists)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Testing Steps

### 1. Verify Configuration

First, check that everything is configured:

```bash
# Start dev server
npm run dev

# Visit test endpoint
curl http://localhost:3000/api/test-errors
```

You should see a JSON response showing the status of your error monitoring setup.

### 2. Test Critical Error (Database Connection)

```bash
curl http://localhost:3000/api/test-errors?type=critical
```

**Expected Results:**
- ✅ Error logged to Supabase `error_logs` table
- ✅ Severity: `critical`
- ✅ Discord notification in `#errors-critical` channel
- ✅ Jira ticket created
- ✅ Log entry includes error hash for deduplication

**Verify:**
1. Check Discord `#errors-critical` channel for notification
2. Check Jira project for new ticket (priority: Highest)
3. Query Supabase:
   ```sql
   SELECT * FROM error_logs 
   WHERE severity = 'critical' 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

### 3. Test High Severity Error (500 Response)

```bash
curl http://localhost:3000/api/test-errors?type=high
```

**Expected Results:**
- ✅ Error logged to Supabase
- ✅ Severity: `high`
- ✅ Discord notification in `#errors-high` channel
- ✅ Jira ticket created
- ✅ Status code: 500

### 4. Test Medium Severity Error (400 Response)

```bash
curl http://localhost:3000/api/test-errors?type=medium
```

**Expected Results:**
- ✅ Error logged to Supabase
- ✅ Severity: `medium`
- ✅ Discord notification in `#errors-medium` channel (if webhook configured)
- ✅ Jira ticket created
- ✅ Status code: 400

### 5. Test Client-Side Errors

Visit in browser:
```
http://localhost:3000/api/test-errors?type=client
```

Click the buttons to test:
- **"Throw Error"** - Tests `window.onerror` handling
- **"Throw Promise Rejection"** - Tests `unhandledrejection` handling

**Expected Results:**
- ✅ Errors logged to Supabase
- ✅ Source: `client`
- ✅ Client-side errors captured by GlobalErrorHandler

### 6. Test Deduplication

Run the same error multiple times:

```bash
# Run 5 times
for i in {1..5}; do 
  curl http://localhost:3000/api/test-errors?type=critical
  sleep 1
done
```

**Expected Results:**
- ✅ Only ONE error log entry created
- ✅ `occurrence_count` incremented to 5
- ✅ `last_seen` updated
- ✅ Only ONE Discord notification
- ✅ Only ONE Jira ticket

**Verify:**
```sql
SELECT error_hash, occurrence_count, first_seen, last_seen 
FROM error_logs 
WHERE severity = 'critical';
```

### 7. Test Error Boundary (React)

To test the React Error Boundary, temporarily add this to a page component:

```tsx
// In any page.tsx
export default function TestPage() {
  throw new Error('Test React Error Boundary');
  return <div>This won't render</div>;
}
```

**Expected Results:**
- ✅ Error caught by ErrorBoundary
- ✅ Fallback UI displayed
- ✅ Error logged to Supabase
- ✅ Source: `client`
- ✅ Component stack included in metadata

### 8. Check Analytics Views

Query the error statistics:

```sql
-- Last 24 hours stats
SELECT * FROM error_stats_24h;

-- Recent critical errors
SELECT * FROM recent_critical_errors;
```

## Verification Checklist

- [ ] Configuration endpoint returns all systems as configured
- [ ] Critical errors appear in Discord `#errors-critical`
- [ ] High errors appear in Discord `#errors-high`
- [ ] Medium errors appear in Discord `#errors-medium` (if configured)
- [ ] All errors create Jira tickets (except LOW/NOISE)
- [ ] All errors logged to Supabase `error_logs` table
- [ ] Deduplication works (same error = count increment, not new entry)
- [ ] Error hash is consistent for same errors
- [ ] Discord notifications include Jira ticket link
- [ ] Client-side errors are captured
- [ ] React Error Boundary catches component errors
- [ ] No errors in server logs from error monitoring itself

## Troubleshooting

### No Discord Notifications

- Check webhook URLs are correct in `.env.local`
- Verify `ENABLE_ERROR_MONITORING=true`
- Check Discord webhook permissions
- Look for error monitoring errors in server logs

### No Jira Tickets

- Verify Jira credentials are correct
- Check Jira API token has proper permissions
- Verify project key matches your Jira project
- Check server logs for Jira API errors

### Errors Not Logged to Supabase

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
- Check `error_logs` table exists
- Verify table permissions allow inserts
- Check server logs for database errors

### Duplicate Errors Creating Multiple Entries

- Check if error hash is being generated correctly
- Verify `get_recent_error_by_hash` function exists in Supabase
- Check time window (1 hour) for deduplication
- Confirm errors have exact same message and stack trace

## Cleanup

After testing, remove test errors from Supabase:

```sql
DELETE FROM error_logs 
WHERE message LIKE '%Test%' 
   OR message LIKE '%test%';
```

Close test Jira tickets and delete Discord test messages if desired.
