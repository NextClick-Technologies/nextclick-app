# Performance Feature

## Overview

Manages employee performance reviews, goals, and performance metrics.

## Directory Structure

```
performance/
├── domain/                 # Domain/Business Logic Layer
│   ├── review.service.ts   # Performance review logic
│   ├── goals.service.ts    # Goal tracking and management
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Performance UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Performance pages
        └── PerformancePage.tsx
```

### Layer Responsibilities

**Domain Layer (`domain/`)**: Core performance management logic including:

- Performance review creation and evaluation
- Goal setting and tracking
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for performance entities

**UI Layer (`ui/`)**: Performance review forms, goal trackers, and metrics dashboards.

## Key Components

- `ReviewForm` - Create and submit performance reviews
- `GoalTracker` - Track employee goals and progress
- `PerformanceMetrics` - Performance metrics visualization
- `ReviewHistory` - Historical performance reviews

## API Endpoints

- `GET /api/performance/reviews` - List performance reviews
- `POST /api/performance/reviews` - Create new review
- `GET /api/performance/reviews/[id]` - Get review by ID
- `PUT /api/performance/reviews/[id]` - Update review
- `GET /api/performance/goals` - List goals
- `POST /api/performance/goals` - Create new goal

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `recharts`
- **Internal:** `@/shared/components/ui`, `@/features/employees`

## Related Features

- Employees - Employee information
- Payroll - Performance-based compensation

## Testing

```bash
# Run unit tests
npm test features/performance

# Run integration tests
npm test -- --grep "performance"
```
