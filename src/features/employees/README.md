# Employees Feature

## Overview

Manages employee information, roles, and organizational structure within the HR system.

## Directory Structure

```
employees/
├── api/                    # API Layer
│   └── employee.handlers.ts # HTTP handlers (GET, POST, PUT, DELETE)
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries (Supabase)
│   ├── service.ts          # Business logic & validation
│   ├── schemas/            # Zod validation schemas
│   │   └── employee.schema.ts
│   ├── types/              # TypeScript type definitions
│   │   └── employee.type.ts
│   └── __tests__/          # Domain layer tests
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Employee-specific UI components
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

- `EmployeeCard` - Display employee information
- `EmployeeForm` - Create/edit employee form
- `EmployeeList` - List view of all employees
- `EmployeeTable` - Data table with sorting and filtering
- `OrgChart` - Organizational chart visualization

## API Endpoints

- `GET /api/employee` - List all employees
- `POST /api/employee` - Create new employee
- `GET /api/employee/[id]` - Get employee by ID
- `PUT /api/employee/[id]` - Update employee
- `DELETE /api/employee/[id]` - Delete employee

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `@supabase/supabase-js`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Payroll - Employee compensation
- Performance - Performance reviews
- Projects - Project assignments

## Testing

```bash
# Run unit tests
npm test features/employees

# Run integration tests
npm test -- --grep "employees"
```
