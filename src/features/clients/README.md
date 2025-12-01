# Clients Feature

## Overview

Manages client information, relationships, and interactions within the CRM system.

## Directory Structure

```
clients/
├── api/                    # API Layer
│   └── handlers.ts         # HTTP handlers (GET, POST, PUT, DELETE)
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries (Supabase)
│   ├── service.ts          # Business logic & validation
│   ├── schemas/            # Zod validation schemas
│   │   └── client.schema.ts
│   ├── types/              # TypeScript type definitions
│   │   └── client.type.ts
│   └── __tests__/          # Domain layer tests
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Client-specific UI components
    ├── hooks/              # React Query hooks for data fetching
    └── pages/              # Next.js page components
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers that parse requests, call service layer, and format responses.

**Domain Layer (`domain/`)**: Core business logic including:

- `repository.ts` - Direct database operations via Supabase
- `service.ts` - Business rules, validation, and orchestration
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces and types

**UI Layer (`ui/`)**: React components, hooks, and pages for the frontend.

## Key Components

- `ClientCard` - Display individual client information
- `ClientForm` - Create/edit client form
- `ClientList` - List view of all clients
- `ClientTable` - Data table with sorting and filtering

## API Endpoints

- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/[id]` - Get client by ID
- `PUT /api/clients/[id]` - Update client
- `DELETE /api/clients/[id]` - Delete client

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `@supabase/supabase-js`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Companies - Parent organization management
- Projects - Client projects

## Testing

```bash
# Run unit tests
npm test features/clients

# Run integration tests
npm test -- --grep "clients"

# Run E2E tests
npm run test:e2e -- --grep "clients"
```

## Development

See [docs/onboarding/FRONTEND.md](../../../docs/onboarding/FRONTEND.md) and [docs/onboarding/BACKEND.md](../../../docs/onboarding/BACKEND.md) for development guidelines.
