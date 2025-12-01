# Error Monitoring Implementation Files

This directory contains all error monitoring implementation files.

## File Structure

```
src/lib/error-monitoring/
├── index.ts              # Main exports
├── types.ts              # TypeScript type definitions
├── handler.ts            # Core error capture & classification
├── supabase.ts           # Supabase error log storage
├── discord.ts            # Discord webhook notifications
├── jira.ts               # Jira API integration
└── api-wrapper.ts        # API route error wrapper

src/components/
├── ErrorBoundary.tsx         # React Error Boundary
└── GlobalErrorHandler.tsx    # Client-side global error handler
```

## Quick Start

### 1. Wrap Your App with Error Boundary

In your root layout or `_app.tsx`:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GlobalErrorHandler } from '@/components/GlobalErrorHandler';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <GlobalErrorHandler />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### 2. Wrap API Routes

```typescript
import { withErrorMonitoring } from '@/lib/error-monitoring/api-wrapper';

export const GET = withErrorMonitoring(async (req) => {
  // Your route logic
});
```

### 3. Manual Error Capture

```typescript
import { captureError } from '@/lib/error-monitoring';

try {
  // risky operation
} catch (error) {
  await captureError(error, {
    source: 'api',
    url: req.url,
    userId: user.id,
  });
}
```

## Components

### handler.ts
Main orchestrator that:
- Classifies error severity
- Filters noise (bots, 404s, etc.)
- Creates error hash for deduplication
- Logs to Supabase
- Sends Discord notifications (CRITICAL/HIGH)
- Creates Jira tickets (MEDIUM+)

### discord.ts
Sends rich embeds to Discord webhooks based on severity level.

### jira.ts
Creates Jira tickets using Atlassian Document Format (ADF).

### supabase.ts
Handles all database operations for error logs.

### api-wrapper.ts
Higher-order function to wrap API routes with error monitoring.

### ErrorBoundary.tsx
React Error Boundary to catch component errors.

### GlobalErrorHandler.tsx
Captures unhandled errors and promise rejections on the client.

## Environment Variables Required

```bash
# Discord
DISCORD_WEBHOOK_CRITICAL=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_HIGH=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_MEDIUM=https://discord.com/api/webhooks/...

# Jira
JIRA_HOST=your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=EM

# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Error Monitoring
ENABLE_ERROR_MONITORING=true
ERROR_MONITORING_ENVIRONMENT=production
```

## Testing

To test error monitoring:

```typescript
// Trigger a test error
throw new Error('Test error for monitoring');
```

1. Check Supabase `error_logs` table
2. Check Discord channel for notification (if CRITICAL/HIGH)
3. Check Jira for new ticket
