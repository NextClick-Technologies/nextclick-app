# Milestone Feature

## Overview

Manages project milestones, tracking progress, dates, and completion status.

## Structure

- `api/` - API endpoints for milestones
- `services/schemas/` - Zod validation schemas
- `ui/` - UI components (to be added)

## API Endpoints

- `GET /api/milestone` - List milestones with pagination and filtering
- `POST /api/milestone` - Create new milestone
- `GET /api/milestone/[id]` - Get specific milestone
- `PATCH /api/milestone/[id]` - Update milestone
- `DELETE /api/milestone/[id]` - Delete milestone

## Dependencies

- Shared API utilities (`@/lib/api/api-utils`)
- Supabase client (`@/lib/supabase/server`)
- Zod for validation

## Testing

Tests to be added in `__tests__/` directory.
