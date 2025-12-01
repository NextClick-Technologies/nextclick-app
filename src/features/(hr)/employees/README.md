# Employees Feature

## Overview
Manages employee information, roles, and organizational structure within the HR system.

## Structure
- `api/` - API endpoints for employee CRUD operations
- `components/` - Employee-specific UI components
- `hooks/` - Custom hooks for employee data management
- `lib/` - Business logic and database queries
- `types/` - TypeScript type definitions
- `schemas/` - Zod validation schemas
- `pages/` - Next.js pages for employee views

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
npm test features/(hr)/employees
```
