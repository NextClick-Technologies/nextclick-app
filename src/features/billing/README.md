# Billing Feature

## Overview

Manages billing, invoicing, and payment processing for projects and services.

## Directory Structure

```
billing/
├── domain/                 # Domain/Business Logic Layer
│   ├── invoice.service.ts  # Invoice generation and management
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Billing UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Billing pages
        └── BillingPage.tsx
```

### Layer Responsibilities

**Domain Layer (`domain/`)**: Core billing logic including:

- Invoice generation and calculations
- Payment processing logic
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for billing entities

**UI Layer (`ui/`)**: Billing forms, invoice displays, and payment interfaces.

## Key Components

- `InvoiceForm` - Create and edit invoices
- `InvoiceList` - List of invoices with filtering
- `PaymentProcessor` - Payment processing interface
- `BillingMetrics` - Revenue and payment metrics

## API Endpoints

- `GET /api/billing/invoices` - List all invoices
- `POST /api/billing/invoices` - Create new invoice
- `GET /api/billing/invoices/[id]` - Get invoice by ID
- `PUT /api/billing/invoices/[id]` - Update invoice
- `DELETE /api/billing/invoices/[id]` - Delete invoice

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `stripe` (or payment provider)
- **Internal:** `@/shared/components/ui`, `@/features/projects`, `@/features/clients`

## Related Features

- Projects - Project billing
- Clients - Client invoicing
- Payment - Payment tracking

## Testing

```bash
# Run unit tests
npm test features/billing

# Run integration tests
npm test -- --grep "billing"
```
