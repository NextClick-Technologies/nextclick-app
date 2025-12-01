# Companies Feature

## Overview
Manages company information and organizational hierarchies within the CRM system.

## Structure
- `api/` - API endpoints for company CRUD operations
- `components/` - Company-specific UI components
- `hooks/` - Custom hooks for company data management
- `lib/` - Business logic and database queries
- `types/` - TypeScript type definitions
- `schemas/` - Zod validation schemas
- `pages/` - Next.js pages for company views

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
npm test features/(crm)/companies
```
