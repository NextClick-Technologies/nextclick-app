# Security Feature

## Overview

Manages security settings, audit logs, access control, and compliance.

## Directory Structure

```
security/
├── api/                    # API Layer
│   ├── audit.handlers.ts   # Audit log handlers
│   └── access.handlers.ts  # Access control handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── audit.repository.ts # Audit log database queries
│   ├── audit.service.ts    # Audit logging logic
│   ├── access.service.ts   # Access control logic
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Security UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Security pages
```

### Layer Responsibilities

**API Layer (`api/`)**: Endpoints for security management and audit logs.

**Domain Layer (`domain/`)**: Core security logic including:

- `audit.repository.ts` - Audit log storage and retrieval
- `audit.service.ts` - Audit event tracking and analysis
- `access.service.ts` - Role-based access control (RBAC)
- `schemas/` - Security validation schemas using Zod
- `types/` - TypeScript interfaces for security entities

**UI Layer (`ui/`)**: Security dashboards, audit log viewers, and access control interfaces.

## Key Components

- `AuditLogViewer` - View and search audit logs
- `AccessControlPanel` - Manage user permissions
- `SecurityDashboard` - Security metrics and alerts
- `ComplianceReports` - Generate compliance reports

## API Endpoints

- `GET /api/security/audit-logs` - List audit logs
- `GET /api/security/audit-logs/[id]` - Get audit log details
- `GET /api/security/access/roles` - List roles
- `PUT /api/security/access/roles/[id]` - Update role permissions
- `GET /api/security/compliance/reports` - Generate compliance reports

## Dependencies

- **External:** `@tanstack/react-query`, `zod`
- **Internal:** `@/shared/lib/supabase`, `@/features/auth`

## Related Features

- Auth - User authentication and authorization
- Employees - User role management

## Testing

```bash
# Run unit tests
npm test features/security

# Run integration tests
npm test -- --grep "security"
```
