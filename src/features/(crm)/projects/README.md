# Projects Feature

## Overview
Manages project information, milestones, team members, and project lifecycle within the CRM system.

## Structure
- `api/` - API endpoints for project CRUD operations
- `components/` - Project-specific UI components
- `hooks/` - Custom hooks for project data management
- `lib/` - Business logic and database queries
- `types/` - TypeScript type definitions
- `schemas/` - Zod validation schemas
- `pages/` - Next.js pages for project views

## Key Components
- `ProjectCard` - Display project summary
- `ProjectForm` - Create/edit project form
- `ProjectList` - List view of all projects
- `ProjectBoard` - Kanban board view
- `MilestoneTracker` - Track project milestones

## API Endpoints
- `GET /api/project` - List all projects
- `POST /api/project` - Create new project
- `GET /api/project/[id]` - Get project by ID
- `PUT /api/project/[id]` - Update project
- `DELETE /api/project/[id]` - Delete project
- `GET /api/project-members` - Project team members
- `GET /api/milestone` - Project milestones

## Dependencies
- **External:** `@tanstack/react-query`, `zod`, `@supabase/supabase-js`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features
- Clients - Project owners
- Employees - Project team members
- Billing - Project invoicing

## Testing
```bash
npm test features/(crm)/projects
```
