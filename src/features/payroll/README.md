# Payroll Feature

## Overview

Manages employee payroll, salaries, deductions, and payment schedules.

## Directory Structure

```
payroll/
├── domain/                 # Domain/Business Logic Layer
│   ├── payroll.service.ts  # Payroll calculations and processing
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Payroll UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Payroll pages
        └── PayrollPage.tsx
```

### Layer Responsibilities

**Domain Layer (`domain/`)**: Core payroll logic including:

- Salary calculations and deductions
- Payment schedule management
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for payroll entities

**UI Layer (`ui/`)**: Payroll forms, payment reports, and employee compensation displays.

## Key Components

- `PayrollForm` - Process payroll
- `SalaryBreakdown` - Salary and deductions breakdown
- `PaymentSchedule` - Payment schedule calendar
- `PayrollReports` - Payroll reports and analytics

## API Endpoints

- `GET /api/payroll` - List payroll records
- `POST /api/payroll` - Process payroll
- `GET /api/payroll/[id]` - Get payroll record by ID
- `PUT /api/payroll/[id]` - Update payroll record
- `GET /api/payroll/reports` - Generate payroll reports

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `date-fns`
- **Internal:** `@/shared/components/ui`, `@/features/employees`

## Related Features

- Employees - Employee salary information
- Performance - Performance-based compensation

## Testing

```bash
# Run unit tests
npm test features/payroll

# Run integration tests
npm test -- --grep "payroll"
```
