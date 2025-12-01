# Clients Feature

## Overview
Manages client information, relationships, and interactions within the CRM system.

## Structure
- `api/` - API endpoints for client CRUD operations
- `components/` - Client-specific UI components
- `hooks/` - Custom hooks for client data management
- `lib/` - Business logic and database queries
- `types/` - TypeScript type definitions
- `schemas/` - Zod validation schemas
- `pages/` - Next.js pages for client views

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
# Run client feature tests
npm test features/(crm)/clients

# Run E2E tests
npm run test:e2e -- --grep "clients"
```

## Development
See [docs/onboarding/FRONTEND.md](../../../docs/onboarding/FRONTEND.md) and [docs/onboarding/BACKEND.md](../../../docs/onboarding/BACKEND.md) for development guidelines.
