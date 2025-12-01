# Companies Feature

## Overview

Manages company information and organizational hierarchies within the CRM system.

## Directory Structure

```
companies/
├── api/                    # API Layer
│   └── company.handlers.ts # HTTP handlers (GET, POST, PUT, DELETE)
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries (Supabase)
│   ├── service.ts          # Business logic & validation
│   ├── schemas/            # Zod validation schemas
│   │   └── company.schema.ts
│   ├── types/              # TypeScript type definitions
│   │   └── company.type.ts
│   └── __tests__/          # Domain layer tests
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Company-specific UI components
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

- `CompanyCard` - Display company information
- `CompanyForm` - Create/edit company form
- `CompanyList` - List view of all companies
- `CompanyTable` - Data table with sorting and filtering

## API Endpoints

- `GET /api/company` - List all companies
- `POST /api/company` - Create new company
- `GET /api/company/[id]` - Get company by ID
- `PUT /api/company/[id]` - Update company
- `DELETE /api/company/[id]` - Delete company

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `@supabase/supabase-js`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Clients - Individual clients associated with companies

## Testing

```bash
# Run unit tests
npm test features/companies

# Run integration tests
npm test -- --grep "companies"
```
