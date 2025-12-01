# Payment Feature

## Overview

Manages project payments, tracking amounts, methods, and completion status.

## Structure

- `api/` - API endpoints for payments
- `services/schemas/` - Zod validation schemas
- `ui/` - UI components (to be added)

## API Endpoints

- `GET /api/payment` - List payments with pagination and filtering
- `POST /api/payment` - Create new payment
- `GET /api/payment/[id]` - Get specific payment
- `PATCH /api/payment/[id]` - Update payment
- `DELETE /api/payment/[id]` - Delete payment

## Dependencies

- Shared API utilities (`@/lib/api/api-utils`)
- Supabase client (`@/lib/supabase/server`)
- Zod for validation

## Testing

Tests to be added in `__tests__/` directory.
