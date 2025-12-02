# Error Monitoring

## Stack

- **Monitoring**: Vercel (deployment)
- **Notifications**: Discord webhooks
- **Ticketing**: Jira (free tier)
- **Storage**: Supabase (`error_logs` table)

> **Note**: All services free for our use case.

## Error Flow

```
Error → Classify → Dedupe → Log (Supabase) → Notify (Discord) → Ticket (Jira)
```

**Features**:

- Auto-classify severity (CRITICAL → NOISE)
- Filter bot traffic and duplicates
- Discord alerts for CRITICAL/HIGH
- Auto-create Jira tickets for new patterns

## Stack Components

### 🚀 Vercel

- **Purpose**: Deployment monitoring
- **Integration**: Sends build/deploy failures to Discord
- **Setup**: Project Settings → Integrations → Discord

### 💬 Discord

- **Purpose**: Real-time error notifications
- **Free Tier**: Unlimited messages and webhooks
- **Channels**:
  - `#errors-critical` - Production down, data loss
  - `#errors-high` - Features broken, user impact
  - `#errors-medium` - Performance issues
  - `#deployment-logs` - Vercel deployment status

### 🎫 Jira

- **Purpose**: Error tracking and ticketing
- **Free Tier**: Up to 10 users, 2GB storage
- **Project**: "Error Monitoring" (EM)
- **Features**:
  - Automatic ticket creation
  - Priority levels
  - Link to Supabase logs
  - Workflow automation

### 🗄️ Supabase

- **Purpose**: Error log storage and analytics
- **Free Tier**: 500MB database
- **Table**: `error_logs` (see migration file)

## Error Flow

```
1. Error occurs → Error Handler
2. Classify severity → Filter noise
3. Check for duplicates → Hash-based dedup
4. Log to Supabase → All errors stored
5. If CRITICAL/HIGH → Discord notification
6. If new pattern → Create Jira ticket
```

## Severity Levels

| Level        | Description                                     | Action                               |
| ------------ | ----------------------------------------------- | ------------------------------------ |
| **CRITICAL** | Production down, database connection lost       | Discord + Jira + Immediate attention |
| **HIGH**     | Feature broken, 5xx errors, auth/payment issues | Discord + Jira                       |
| **MEDIUM**   | Performance degraded, 4xx errors                | Jira only                            |
| **LOW**      | Minor issues, edge cases                        | Log only                             |
| **NOISE**    | Bots, single 404s, expected errors              | Ignore                               |

## Setup Guide

### 1. Discord Setup

**Create Server and Channels:**

```bash
1. Create Discord server (or use existing)
2. Create channels:
   - #errors-critical
   - #errors-high
   - #errors-medium
   - #deployment-logs
```

**Create Webhooks:**

```bash
# For each channel:
1. Channel Settings → Integrations → Webhooks
2. Create Webhook → Copy URL
3. Add to .env.local:
```

### 2. Jira Setup

**Create Account:**

```bash
1. Go to https://www.atlassian.com/software/jira/free
2. Sign up (free for up to 10 users)
3. Create project: "Error Monitoring" (key: EM)
```

**Generate API Token:**

```bash
1. Visit https://id.atlassian.com/manage-profile/security/api-tokens
2. Create API token
3. Save credentials to .env.local
```

### 3. Supabase Migration

Run the migration file to create the `error_logs` table:

```bash
# In Supabase SQL Editor, run:
src/lib/supabase/migrations/YYYYMMDD_create_error_logs.sql
```

### 4. Vercel Deployment Monitoring

> [!NOTE]
> Vercel webhooks require a **Pro plan** ($20/month). For free/hobby tier, manually check the Vercel dashboard for deployment status.

**Option A: Manual Monitoring (Free)**

- Check Vercel dashboard for deployment status
- Deployment errors are visible immediately
- Failed deployments don't affect production
- Good enough for small apps

**Option B: Automated (Pro Plan Required)**

- Requires Vercel Pro plan
- See [VERCEL_DISCORD_INTEGRATION.md](./VERCEL_DISCORD_INTEGRATION.md) for setup
- Automatically posts deployment events to Discord

**What's still monitored for free:**

- ✅ Runtime errors in production (via our error monitoring)
- ✅ API errors (logged to Supabase, Discord, Jira)
- ✅ Client-side errors (captured by ErrorBoundary)
- ✅ Database errors (monitored and alerted)

**Note:** Deployment errors ≠ Runtime errors. Our error monitoring system will catch all runtime errors in production regardless of Vercel plan.

## Environment Variables

Add to `.env.local`:

```bash
# Discord Webhooks
DISCORD_WEBHOOK_CRITICAL=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_HIGH=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_MEDIUM=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_DEPLOY=https://discord.com/api/webhooks/...

# Jira
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=EM

# Error Monitoring
ENABLE_ERROR_MONITORING=true
ERROR_MONITORING_ENVIRONMENT=production
```

## Usage

### Capturing Errors

Errors are automatically captured from:

**API Routes:**

```typescript
// Wrap route handlers
import { withErrorMonitoring } from "@/lib/error-monitoring";

export const GET = withErrorMonitoring(async (req) => {
  // Your code
});
```

**Client-Side:**

```typescript
// Error Boundary wraps app
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

**Manual Capture:**

```typescript
import { captureError } from "@/lib/error-monitoring";

try {
  // risky operation
} catch (error) {
  await captureError(error, {
    source: "api",
    url: "/api/some-route",
    userId: user.id,
  });
}
```

### Viewing Errors

**Discord:**

- Real-time notifications in appropriate channels
- Click Jira link to view full details

**Jira:**

- Browse all error tickets
- Filter by severity, source, or date
- Track resolution status

**Supabase:**

- Query `error_logs` table directly
- View `error_stats` for analytics
- Build custom dashboards

## Smart Features

### Deduplication

Errors with the same hash (type + message + stack trace) within 1 hour are grouped:

- Occurrence count incremented
- Last seen timestamp updated
- No duplicate Discord/Jira notifications

### Noise Filtering

Automatically ignores:

- Bot traffic (curl, wget, spiders)
- Single 404 errors
- Development environment errors
- Hydration warnings (unless frequent)

### Automatic Classification

- Database connection errors → CRITICAL
- 5xx status codes → HIGH
- Auth/payment routes → HIGH
- 4xx status codes → MEDIUM
- 404 errors → NOISE (filtered)

## Monitoring Best Practices

1. **Check Discord daily** - Review critical/high errors
2. **Triage Jira weekly** - Assign and prioritize tickets
3. **Review Supabase monthly** - Analyze error trends
4. **Tune filters as needed** - Adjust classification rules
5. **Keep webhooks private** - Never commit to Git

## Troubleshooting

**Discord not receiving notifications:**

- Check webhook URL is correct
- Verify severity matches channel
- Check `ENABLE_ERROR_MONITORING=true`

**Jira tickets not created:**

- Verify API token is valid
- Check project key matches
- Review Jira API rate limits

**Too many notifications:**

- Increase severity threshold
- Add more noise filters
- Review deduplication logic

## Cost Breakdown

| Service   | Plan             | Cost         | Notes                            |
| --------- | ---------------- | ------------ | -------------------------------- |
| Vercel    | Hobby            | $0           | Webhooks require Pro ($20/month) |
| Discord   | Free             | $0           | Unlimited messages               |
| Jira      | Free (≤10 users) | $0           | 2GB storage                      |
| Supabase  | Free tier        | $0           | 500MB database                   |
| **Total** |                  | **$0/month** | Manual deployment monitoring     |

**Note:** All runtime error monitoring is free. Only deployment webhook automation requires paid plan.

## Next Steps

After setup:

1. Deploy error monitoring code
2. Test with intentional errors
3. Monitor for 24-48 hours
4. Fine-tune severity classification
5. Document any team-specific workflows
