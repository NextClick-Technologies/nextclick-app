# Dashboard Feature

## Overview

Main dashboard interface with metrics, insights, and overview of key application data.

## Directory Structure

```
dashboard/
├── domain/                 # Domain/Business Logic Layer
│   └── analytics.ts        # Analytics and data aggregation
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Dashboard UI components
    │   ├── MetricCard.tsx
    │   ├── InsightCard.tsx
    │   ├── LiveCollaboration.tsx
    │   └── ActivityFeed.tsx
    └── pages/              # Dashboard page
        └── DashboardPage.tsx
```

### Layer Responsibilities

**Domain Layer (`domain/`)**: Analytics and data aggregation logic.

**UI Layer (`ui/`)**: Dashboard components aggregating data from multiple features.

## Key Components

- `MetricCard` - Display key metrics (clients, projects, revenue)
- `InsightCard` - AI-powered insights
- `LiveCollaboration` - Real-time collaboration status
- `ActivityFeed` - Recent activity

## Data Sources

- Client statistics
- Project status
- Financial metrics
- Team activity

## Dependencies

- **External:** `@tanstack/react-query`, `date-fns`
- **Internal:** `@/shared/components/ui`, multiple feature APIs

## Related Features

- Clients - Client metrics
- Projects - Project statistics
- Employees - Team utilization

## Testing

```bash
# Run unit tests
npm test features/dashboard

# Run integration tests
npm test -- --grep "dashboard"
```
