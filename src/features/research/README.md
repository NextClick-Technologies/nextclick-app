# Research Feature

## Overview

Manages research activities, findings, and knowledge management.

## Directory Structure

```
research/
├── api/                    # API Layer
│   └── handlers.ts         # Research CRUD handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries
│   ├── service.ts          # Research management logic
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Research UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Research pages
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers for research operations.

**Domain Layer (`domain/`)**: Core research logic including:

- `repository.ts` - Database operations for research data
- `service.ts` - Research business logic and organization
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for research entities

**UI Layer (`ui/`)**: Research forms, knowledge base, and search interfaces.

## Key Components

- `ResearchForm` - Create and edit research entries
- `ResearchList` - Browse research findings
- `KnowledgeGraph` - Visualize research connections
- `SearchInterface` - Search across research data

## API Endpoints

- `GET /api/research` - List research entries
- `POST /api/research` - Create new research entry
- `GET /api/research/[id]` - Get research entry by ID
- `PUT /api/research/[id]` - Update research entry
- `DELETE /api/research/[id]` - Delete research entry

## Dependencies

- **External:** `@tanstack/react-query`, `zod`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Projects - Project-related research
- Documents - Research documents

## Testing

```bash
# Run unit tests
npm test features/research

# Run integration tests
npm test -- --grep "research"
```
