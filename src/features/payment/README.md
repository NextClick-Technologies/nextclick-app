# Payment Feature

## Overview

Manages project payments, tracking amounts, methods, and completion status.

## Directory Structure

```
payment/
├── api/                    # API Layer
│   ├── handlers.ts         # List and create handlers
│   └── [id]/handlers.ts    # Get, update, delete handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── schemas/            # Zod validation schemas
│   │   └── index.ts        # Payment schemas export
│   └── types/              # TypeScript type definitions
│       └── payment.type.ts
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Payment UI components
    └── hooks/              # React Query hooks
        └── usePayment.ts
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers that parse requests and delegate to business logic.

**Domain Layer (`domain/`)**: Core business logic including:

- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for payments (PaymentStatus, PaymentMethod)

**UI Layer (`ui/`)**: Payment components and data fetching hooks.

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

```bash
# Run unit tests
npm test features/payment

# Run integration tests
npm test -- --grep "payment"
```

Tests are located in `__tests__/` directory.
