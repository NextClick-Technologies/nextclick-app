# Service Management Feature

## Overview

Manages service catalog, service delivery, and service-level agreements (SLAs).

## Directory Structure

```
service-mgmt/
├── api/                    # API Layer
│   └── handlers.ts         # Service management handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries
│   ├── service.ts          # Service management logic
│   ├── sla.service.ts      # SLA tracking and management
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Service management UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Service management pages
```

### Layer Responsibilities

**API Layer (`api/`)**: Endpoints for service catalog and SLA management.

**Domain Layer (`domain/`)**: Core service management logic including:

- `repository.ts` - Service catalog database operations
- `service.ts` - Service business logic
- `sla.service.ts` - SLA tracking and compliance monitoring
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for services and SLAs

**UI Layer (`ui/`)**: Service catalog, SLA dashboards, and service delivery interfaces.

## Key Components

- `ServiceCatalog` - Browse available services
- `ServiceForm` - Create and edit services
- `SLADashboard` - Monitor SLA compliance
- `ServiceMetrics` - Service delivery metrics

## API Endpoints

- `GET /api/services` - List services
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get service by ID
- `PUT /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service
- `GET /api/services/sla` - List SLAs
- `GET /api/services/sla/[id]/compliance` - Check SLA compliance

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `date-fns`
- **Internal:** `@/shared/components/ui`, `@/features/clients`, `@/features/projects`

## Related Features

- Clients - Client services
- Projects - Service delivery projects

## Testing

```bash
# Run unit tests
npm test features/service-mgmt

# Run integration tests
npm test -- --grep "service-mgmt"
```
