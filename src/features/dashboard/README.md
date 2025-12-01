# Dashboard Feature

## Overview
Main dashboard interface with metrics, insights, and overview of key application data.

## Structure
- `components/` - Dashboard-specific components
- `lib/` - Analytics and data aggregation logic
- `pages/` - Dashboard page

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
npm test features/(core)/dashboard
```
