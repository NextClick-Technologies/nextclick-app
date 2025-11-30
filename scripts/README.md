# Development Scripts

This directory contains scripts for enhanced development workflows.

## Scripts

### `dev.js`
Main development script using `concurrently` to run multiple processes with colored prefixes.

**Runs:**
- **[next]** - Next.js dev server with pino-pretty log formatting
- **[tsc]** - TypeScript type checker in watch mode

**Features:**
- Color-coded process prefixes (magenta for Next.js, cyan for TypeScript)
- Automatic log prettification for structured logs
- Real-time type checking alongside development
- Graceful shutdown handling
- Kills all processes if one fails

**Usage:**
```bash
npm run dev
```

**Alternative commands:**
- `npm run dev:next-only` - Just Next.js with pretty logs (no type checker)
- `npm run dev:simple` - Plain Next.js dev server (no pretty logs, no type checker)

### `cleanup-pino.js`
Postinstall script that removes test files from pino packages to prevent build issues with Turbopack.

**What it does:**
- Removes `test/` directories from `pino` and `thread-stream` packages
- Removes problematic files (LICENSE, README.md, bench.js) that Turbopack tries to parse
- Runs automatically after `npm install`

### `helpers/logger.js`
Simple logger utility for scripts with colored output.

**Methods:**
- `Logger.info(message)` - Blue info message
- `Logger.success(message)` - Green success message
- `Logger.error(message)` - Red error message
- `Logger.warn(message)` - Yellow warning message
