# Milestone Feature

## Overview

Manages project milestones, tracking progress, dates, and completion status.

## Directory Structure

```
milestone/
├── api/                    # API Layer
│   ├── handlers.ts         # List and create handlers
│   └── [id]/handlers.ts    # Get, update, delete handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── schemas/            # Zod validation schemas
│   │   └── index.ts        # Milestone schemas export
│   └── types/              # TypeScript type definitions
│       └── milestone.type.ts
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Milestone UI components
    └── hooks/              # React Query hooks
        └── useMilestone.ts
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers that parse requests and delegate to business logic.

**Domain Layer (`domain/`)**: Core business logic including:

- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for milestones

**UI Layer (`ui/`)**: Milestone components and data fetching hooks.

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

```bash
# Run unit tests
npm test features/milestone

# Run integration tests
npm test -- --grep "milestone"
```

Tests are located in `__tests__/` directory.
