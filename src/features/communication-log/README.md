# Communication Log Feature

## Overview

Manages communication logs between clients and employees, tracking channels, summaries, and follow-up requirements.

## Structure

- `api/` - API endpoints for communication logs
- `services/schemas/` - Zod validation schemas
- `ui/` - UI components (to be added)

## API Endpoints

- `GET /api/communication-log` - List communication logs with pagination and filtering
- `POST /api/communication-log` - Create new communication log
- `GET /api/communication-log/[id]` - Get specific communication log
- `PATCH /api/communication-log/[id]` - Update communication log
- `DELETE /api/communication-log/[id]` - Delete communication log

## Dependencies

- Shared API utilities (`@/lib/api/api-utils`)
- Supabase client (`@/lib/supabase/server`)
- Zod for validation

## Testing

Tests to be added in `__tests__/` directory.
