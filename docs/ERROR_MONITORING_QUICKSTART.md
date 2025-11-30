# Error Monitoring Quick Start

## **Problem: Nothing showing up in Discord/Jira/Supabase?**

### 1. Check if ENABLE_ERROR_MONITORING is set

Make sure your `.env.local` has:

```bash
ENABLE_ERROR_MONITORING=true
```

### 2. Configure Environment

**For Development (Default: Disabled)**
By default, error monitoring is **ignored** in development to prevent noise.
To enable it for testing, add to `.env.local`:
```bash
ERROR_MONITORING_ENVIRONMENT=development
```

**For Production (Default: Enabled)**
In Vercel, just set:
```bash
ENABLE_ERROR_MONITORING=true
ERROR_MONITORING_ENVIRONMENT=production
```

### 3. Restart your dev server

After changing `.env.local`:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### 4. Test again

```bash
curl http://localhost:3000/api/test-errors?type=critical
```

You should now see:
1. Log entry in terminal: `[INFO] Logged new error`
2. Entry in Supabase `error_logs` table
3. Discord notification (if webhook configured)
4. Jira ticket (if credentials configured)

## Environment Variables Checklist

**Required for any monitoring:**
- ✅ `ENABLE_ERROR_MONITORING=true`
- ✅ `NEXT_PUBLIC_SUPABASE_URL=...`
- ✅ `SUPABASE_SERVICE_ROLE_KEY=...` (NOT anon key!)

**For Discord notifications:**
- ✅ `DISCORD_WEBHOOK_CRITICAL=https://discord.com/api/webhooks/...`
- ✅ `DISCORD_WEBHOOK_HIGH=https://discord.com/api/webhooks/...`
- ⚠️ `DISCORD_WEBHOOK_MEDIUM=...` (optional)

**For Jira tickets:**
- ✅ `JIRA_HOST=your-domain.atlassian.net`
- ✅ `JIRA_EMAIL=your-email@example.com`
- ✅ `JIRA_API_TOKEN=...`
- ✅ `JIRA_PROJECT_KEY=EM`

## Common Issues

### "Ignoring noise error" in logs
- Fixed! The development filter was too aggressive
- Should work now after the update

### Nothing in Supabase
- Check `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Verify `error_logs` table exists
- Check server logs for database errors

### No Discord notifications
- Verify webhook URL is correct
- Check channel permissions
- Test webhook directly:
  ```bash
  curl -X POST YOUR_WEBHOOK_URL \
    -H "Content-Type: application/json" \
    -d '{"content":"Test message"}'
  ```

### No Jira tickets
- Verify API token is valid
- Check project key exists
- Review server logs for Jira errors
