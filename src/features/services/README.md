# Services Feature

## Overview

Manages professional services offered to clients, including service definitions, pricing, and delivery.

## Directory Structure

```
services/
├── api/                    # API Layer
│   └── handlers.ts         # Service CRUD handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries
│   ├── service.ts          # Service business logic
│   ├── pricing.service.ts  # Pricing calculations
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Service UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Service pages
```

### Layer Responsibilities

**API Layer (`api/`)**: Endpoints for service CRUD operations.

**Domain Layer (`domain/`)**: Core service logic including:

- `repository.ts` - Service database operations
- `service.ts` - Service business logic and validation
- `pricing.service.ts` - Dynamic pricing calculations
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for services

**UI Layer (`ui/`)**: Service catalog, pricing displays, and service management interfaces.

## Key Components

- `ServiceCard` - Display service information
- `ServiceForm` - Create and edit services
- `ServiceList` - Browse all services
- `PricingCalculator` - Calculate service pricing

## API Endpoints

- `GET /api/services` - List all services
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get service by ID
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service
- `POST /api/services/[id]/pricing` - Calculate pricing

## Dependencies

- **External:** `@tanstack/react-query`, `zod`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Clients - Client service subscriptions
- Projects - Service delivery projects
- Billing - Service invoicing

## Testing

```bash
# Run unit tests
npm test features/services

# Run integration tests
npm test -- --grep "services"
```
