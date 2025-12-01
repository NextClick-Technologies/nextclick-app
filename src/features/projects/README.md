# Projects Feature

## Overview

Manages project information, milestones, team members, and project lifecycle within the CRM system.

## Directory Structure

```
projects/
├── api/                    # API Layer
│   ├── projects.handlers.ts # Project CRUD handlers
│   └── project-members.handlers.ts # Team member handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries (Supabase)
│   ├── projects.service.ts # Project business logic
│   ├── project-members.service.ts # Team member logic
│   ├── schemas/            # Zod validation schemas
│   │   └── project.schema.ts
│   ├── types/              # TypeScript type definitions
│   │   └── project.type.ts
│   └── __tests__/          # Domain layer tests
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Project-specific UI components
    ├── hooks/              # React Query hooks for data fetching
    └── pages/              # Next.js page components
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers that parse requests, call service layer, and format responses.

**Domain Layer (`domain/`)**: Core business logic including:

- `repository.ts` - Direct database operations via Supabase
- `projects.service.ts` - Project business rules, validation, and orchestration
- `project-members.service.ts` - Team member management logic
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces and types

**UI Layer (`ui/`)**: React components, hooks, and pages for the frontend.

## Key Components

- `ProjectCard` - Display project summary
- `ProjectForm` - Create/edit project form
- `ProjectList` - List view of all projects
- `ProjectBoard` - Kanban board view
- `MilestoneTracker` - Track project milestones

## API Endpoints

- `GET /api/project` - List all projects
- `POST /api/project` - Create new project
- `GET /api/project/[id]` - Get project by ID
- `PUT /api/project/[id]` - Update project
- `DELETE /api/project/[id]` - Delete project
- `GET /api/project-members` - Project team members
- `GET /api/milestone` - Project milestones

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `@supabase/supabase-js`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Clients - Project owners
- Employees - Project team members
- Billing - Project invoicing

## Testing

```bash
# Run unit tests
npm test features/projects

# Run integration tests
npm test -- --grep "projects"
```
