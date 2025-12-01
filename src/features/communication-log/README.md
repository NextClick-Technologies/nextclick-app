# Communication Log Feature

## Overview

Manages communication logs between clients and employees, tracking channels, summaries, and follow-up requirements.

## Directory Structure

```
communication-log/
├── api/                    # API Layer
│   ├── handlers.ts         # List and create handlers
│   └── [id]/handlers.ts    # Get, update, delete handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── schemas/            # Zod validation schemas
│   │   └── index.ts        # Communication log schemas export
│   └── types/              # TypeScript type definitions
│       └── communication-log.type.ts
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Communication log UI components
    └── hooks/              # React Query hooks
        └── useCommunicationLog.ts
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers that parse requests and delegate to business logic.

**Domain Layer (`domain/`)**: Core business logic including:

- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for communication logs (CommunicationChannel)

**UI Layer (`ui/`)**: Communication log components and data fetching hooks.

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

```bash
# Run unit tests
npm test features/communication-log

# Run integration tests
npm test -- --grep "communication-log"
```

Tests are located in `__tests__/` directory.
