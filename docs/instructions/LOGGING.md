# Logging

## Stack

- **Library**: `pino` (structured, high-performance)
- **Dev**: `pino-pretty` (human-readable)
- **Production**: JSON output (for log aggregation)

## Quick Start

```bash
npm run dev          # Pretty logs + TypeScript watch
npm run dev:next-only # Pretty logs only
npm run dev:simple   # No pretty logs, no type check
```

## Usage

### Basic Logging

Import the `logger` from `@/lib/logger` and use the appropriate log level methods: `info`, `warn`, `error`, `debug`.

```typescript
import { logger } from "@/lib/logger";

// Info: Significant business events
logger.info({ userId: "123" }, "User logged in");

// Warn: Abnormal situations
logger.warn({ attempt: 3 }, "Multiple failed login attempts");

// Error: Operations failed
logger.error({ err: error }, "Database connection failed");

// Debug: Detailed information for troubleshooting (hidden in production by default)
logger.debug({ payload }, "Processing payload");
```

**Note:** Always pass an object as the first argument to include context.

### Request Logging

For API routes or middleware, use the `logRequest` helper to log canonical request details.

```typescript
import { logRequest } from "@/lib/request-logger";

export async function POST(req: NextRequest) {
  try {
    // ... logic ...
    logRequest(req, { status: 200, method: "POST", url: "/api/..." });
  } catch (error) {
    logRequest(req, { status: 500, error });
  }
}
```

## Configuration

The logger is configured in `src/lib/logger.ts`.

- **Development**: Uses `pino-pretty` for colorful, human-readable logs.
- **Production**: Outputs JSON for log aggregation systems.

### Environment Variables

- `LOG_LEVEL`: Set the minimum log level (default: `info` in prod, `debug` in dev).
  - Example: `LOG_LEVEL=debug npm start`

### Redaction

Sensitive keys are automatically redacted from logs. Do not log sensitive information in the message string; put it in the object.

**Redacted Keys:**

- `password`
- `token`
- `secret`
- `authorization`
- `cookie`
- `user.password`
- `user.token`

## Best Practices

1.  **Structure Your Logs**: Always use objects for context. `logger.info("message", { context })` is WRONG. Use `logger.info({ context }, "message")`.
2.  **Don't Log Sensitive Info**: Even with redaction, be careful.
3.  **Use Correct Levels**:
    - `ERROR`: Action required / operation failed.
    - `WARN`: Something looks wrong but app can continue.
    - `INFO`: Key business events (login, purchase, etc.).
    - `DEBUG`: detailed info for developers.
4.  **Don't use `console.log`**: Use the logger instead.

## Build Notes

### Turbopack Compatibility

The logger uses `eval('require')` to dynamically load pino at runtime, which prevents Turbopack from analyzing it during the build process. This is necessary because pino uses Node.js worker_threads which Turbopack cannot bundle.

A postinstall script automatically removes test files from pino packages to keep the build clean.
