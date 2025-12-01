# Codebase Refactoring Plan: Feature-Based Architecture

**Date:** December 1, 2025  
**Goal:** Transform codebase into feature-based architecture for better team collaboration and scalability  
**Approach:** Domain-Driven Design (DDD) with vertical slices  

##  Executive Summary

### Current Problems

1. **Technical layer separation** - Frontend/backend code scattered across `app/`, `components/`, `lib/`, `types/`
2. **Feature discovery is hard** - Hard to find all code related to a feature
3. **Team conflicts** - Multiple developers editing same directories
4. **Tight coupling** - Shared utilities and types create dependencies
5. **Difficult refactoring** - Changing one feature affects entire codebase

### Proposed Solution: Feature-Based Architecture

**Benefits:**
- ✅ **Clear ownership** - Each feature is self-contained
- ✅ **Parallel development** - Teams work independently
- ✅ **Easy onboarding** - New developers see complete feature in one place
- ✅ **Faster development** - Less file jumping and context switching
- ✅ **Better testing** - Test entire feature in isolation
- ✅ **Simplified deployment** - Deploy features independently

---

## 🎯 New Architecture Overview

### Concept: Vertical Slices

Instead of organizing by technical layer (components, lib, types), organize by **business domain** (feature).

**Before (Layered):**
```
src/
├── app/              # Routes
├── components/       # All UI components
├── lib/              # All business logic
├── types/            # All types
└── hooks/            # All hooks
```

**After (Feature-Based):**
```
src/
├── features/         # Feature modules (vertical slices)
│   ├── clients/      # Everything for clients
│   ├── projects/     # Everything for projects
│   └── employees/    # Everything for employees
└── shared/           # Truly shared code
```

---

## 📁 Detailed New Structure

```
src/
├── features/                    # Feature modules (vertical slices)
│   │
│   ├── (crm)/                  # 🎯 ROUTE GROUP: Customer Relationship Management
│   │   ├── clients/
│   │   │   ├── api/                # API routes
│   │   │   │   ├── route.ts        # GET /api/clients
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # GET/PUT/DELETE /api/clients/[id]
│   │   │   ├── components/         # UI components
│   │   │   │   ├── ClientCard.tsx
│   │   │   │   ├── ClientForm.tsx
│   │   │   │   ├── ClientList.tsx
│   │   │   │   └── ClientTable.tsx
│   │   │   ├── hooks/              # Custom hooks
│   │   │   │   ├── useClients.ts
│   │   │   │   ├── useClient.ts
│   │   │   │   └── useClientMutations.ts
│   │   │   ├── lib/                # Business logic
│   │   │   │   ├── queries.ts      # Supabase queries
│   │   │   │   ├── mutations.ts    # Create/Update/Delete
│   │   │   │   └── utils.ts        # Client-specific utilities
│   │   │   ├── types/              # TypeScript types
│   │   │   │   └── index.ts        # Client, CreateClientInput, etc.
│   │   │   ├── schemas/            # Zod validation schemas
│   │   │   │   └── index.ts        # clientSchema, updateClientSchema
│   │   │   ├── pages/              # Next.js pages (routes)
│   │   │   │   ├── page.tsx        # /clients
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # /clients/[id]
│   │   │   └── README.md           # Feature documentation
│   │   │
│   │   ├── companies/
│   │   │   └── ... (same structure)
│   │   │
│   │   └── projects/
│   │       └── ... (same structure)
│   │
│   ├── (hr)/                   # 🎯 ROUTE GROUP: Human Resources
│   │   ├── employees/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── types/
│   │   │   ├── schemas/
│   │   │   ├── pages/
│   │   │   └── README.md
│   │   │
│   │   ├── payroll/
│   │   │   └── ... (same structure)
│   │   │
│   │   └── performance/
│   │       └── ... (same structure)
│   │
│   ├── (finance)/              # 🎯 ROUTE GROUP: Financial Management
│   │   ├── billing/
│   │   │   └── ... (same structure)
│   │   │
│   │   └── payments/
│   │       └── ... (same structure)
│   │
│   ├── (core)/                 # 🎯 ROUTE GROUP: Core Features
│   │   ├── auth/               # Authentication
│   │   │   ├── api/
│   │   │   │   ├── signin/
│   │   │   │   ├── signup/
│   │   │   │   └── reset-password/
│   │   │   ├── components/
│   │   │   │   ├── SignInForm.tsx
│   │   │   │   └── SignUpForm.tsx
│   │   │   ├── lib/
│   │   │   │   ├── password.ts
│   │   │   │   └── session.ts
│   │   │   ├── pages/
│   │   │   │   ├── signin/
│   │   │   │   └── signup/
│   │   │   └── README.md
│   │   │
│   │   ├── dashboard/          # Dashboard
│   │   │   ├── components/
│   │   │   │   ├── MetricCard.tsx
│   │   │   │   └── InsightCard.tsx
│   │   │   ├── lib/
│   │   │   │   └── analytics.ts
│   │   │   ├── pages/
│   │   │   │   └── page.tsx    # /dashboard
│   │   │   └── README.md
│   │   │
│   │   └── documents/          # Document management
│   │       └── ... (same structure)
│
├── shared/                      # Truly shared code
│   ├── components/             # Generic UI components
│   │   ├── ui/                 # Shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ThemeProvider.tsx
│   │
│   ├── lib/                    # Shared utilities
│   │   ├── supabase/          # Supabase client setup
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── migrations/
│   │   ├── logger.ts          # Pino logger
│   │   ├── error-monitoring/  # Error monitoring
│   │   └── utils/             # Generic utilities
│   │       ├── date.ts
│   │       ├── format.ts
│   │       └── validation.ts
│   │
│   ├── hooks/                  # Generic hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── types/                  # Global types
│   │   ├── api.ts             # API response types
│   │   └── common.ts          # Common types
│   │
│   ├── config/                 # App configuration
│   │   ├── constants.ts
│   │   └── env.ts
│   │
│   └── providers/              # React providers
│       ├── QueryProvider.tsx
│       └── ThemeProvider.tsx
│
├── app/                        # Next.js App Router (minimal)
│   ├── (app)/                  # App layout group
│   │   ├── layout.tsx          # Main app layout
│   │   └── page.tsx            # Home/redirect
│   │
│   ├── api/                    # API route mappings (delegates to features)
│   │   ├── clients/            # → features/clients/api
│   │   ├── projects/           # → features/projects/api
│   │   └── employees/          # → features/employees/api
│   │
│   ├── clients/                # Page route mappings (delegates to features)
│   │   └── [[...slug]]/        
│   │       └── page.tsx        # → features/clients/pages
│   │
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
│
└── styles/                     # Global styles
    └── globals.css
```

---

## 🎯 Route Groups for Better Organization

### Why Use Route Groups?

Route groups (folders with parentheses like `(crm)/`) provide **logical organization without affecting URLs**.

**Benefits:**
- ✅ Group related features by business domain
- ✅ Clearer purpose and intent
- ✅ Better team organization (CRM team, HR team, Finance team)
- ✅ Doesn't affect routing structure
- ✅ Easier to navigate codebase

### Recommended Route Groups

```
features/
├── (crm)/              # Customer Relationship Management
│   ├── clients/
│   ├── companies/
│   └── projects/
│
├── (hr)/               # Human Resources
│   ├── employees/
│   ├── payroll/
│   └── performance/
│
├── (finance)/          # Financial Management
│   ├── billing/
│   └── payments/
│
└── (core)/             # Core Application Features
    ├── auth/
    ├── dashboard/
    └── documents/
```

### Import Paths with Route Groups

```typescript
// Route groups are transparent in imports
import { ClientCard } from '@/features/(crm)/clients/components/ClientCard';
// Can also use without parentheses (both work):
import { ClientCard } from '@/features/clients/components/ClientCard';
```

### Team Assignment Example

- **CRM Team:** `features/(crm)/`
- **HR Team:** `features/(hr)/`
- **Finance Team:** `features/(finance)/`
- **Platform Team:** `features/(core)/` + `shared/`

---

## 🔑 Key Principles

### 1. Feature Ownership

Each feature folder contains **everything** related to that feature:
- API routes
- UI components
- Business logic
- Types & schemas
- Hooks
- Tests

**Example:** To understand the `clients` feature, you only need to look in `features/clients/`.

### 2. Shared vs Feature Code

**Feature Code** (in `features/[feature]/`):
- Specific to one business domain
- Not reused by other features
- Examples: `ClientForm`, `getClientById`, `clientSchema`

**Shared Code** (in `shared/`):
- Generic, reusable across features
- No feature-specific logic
- Examples: `Button`, `logger`, `formatDate`

### 3. Import Rules

```typescript
// ✅ ALLOWED: Feature importing from shared
import { Button } from '@/shared/components/ui/button';
import { logger } from '@/shared/lib/logger';

// ✅ ALLOWED: Feature importing its own code
import { ClientCard } from '../components/ClientCard';
import { getClients } from '../lib/queries';

// ❌ NOT ALLOWED: Feature importing from another feature
import { ProjectCard } from '@/features/projects/components/ProjectCard';
// If you need this, move it to shared/

// ❌ NOT ALLOWED: Shared importing from features
import { ClientCard } from '@/features/clients/components/ClientCard';
// Shared cannot depend on features!
```

### 4. Testing Strategy

Each feature has its own test directory:

```
features/clients/
├── __tests__/
│   ├── api.test.ts
│   ├── components/
│   │   ├── ClientCard.test.tsx
│   │   └── ClientForm.test.tsx
│   └── lib/
│       └── queries.test.ts
```

---

## 📋 Migration Plan

### Phase 1: Preparation (Week 1)

**Goal:** Set up new structure without breaking existing code

#### Step 1: Create Feature Directories

```bash
mkdir -p src/features/{clients,projects,employees,companies,auth,dashboard}
mkdir -p src/shared/{components,lib,hooks,types,config,providers}
```

#### Step 2: Create Feature README templates

For each feature, create a README:

```markdown
# [Feature Name] Feature

## Overview
Brief description of what this feature does.

## Structure
- `api/` - API endpoints
- `components/` - UI components
- `lib/` - Business logic
- `types/` - TypeScript types
- `schemas/` - Validation schemas
- `pages/` - Next.js pages

## Key Components
- ComponentA - Description
- ComponentB - Description

## API Endpoints
- `GET /api/[feature]` - Description
- `POST /api/[feature]` - Description

## Dependencies
- Feature dependencies (if any)
- External packages used

## Testing
How to test this feature.
```

---

### Phase 2: Migrate Shared Code (Week 2)

**Goal:** Move truly generic code to shared folder first

#### Shared Components

**Move these to `shared/components/`:**
- `src/components/ui/*` → `shared/components/ui/`
- `src/components/layout/*` → `shared/components/layout/`
- `src/components/ErrorBoundary.tsx` → `shared/components/ErrorBoundary.tsx`
- `src/components/ThemeProvider.tsx` → `shared/components/ThemeProvider.tsx`

#### Shared Library Code

**Move these to `shared/lib/`:**
- `src/lib/logger.ts` → `shared/lib/logger.ts`
- `src/lib/error-monitoring/` → `shared/lib/error-monitoring/`
- `src/lib/supabase/` → `shared/lib/supabase/`
- `src/lib/auth.ts` → Keep in `features/auth/lib/` (feature-specific)

#### Shared Hooks

**Move these to `shared/hooks/`:**
- Generic hooks like `useDebounce`, `useLocalStorage`
- Keep feature-specific hooks in feature folders

#### Update Imports

Use path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Phase 3: Migrate Features One by One (Weeks 3-6)

**Strategy:** Migrate one feature at a time, keep app working

#### Example: Migrate Clients Feature

**Step 1: Move Types**
```bash
# Create types file
touch src/features/clients/types/index.ts

# Move types from src/types/client.types.ts
mv src/types/client.types.ts src/features/clients/types/index.ts
```

**Step 2: Move Schemas**
```bash
# Create schemas file
touch src/features/clients/schemas/index.ts

# Move schemas from src/schemas/
mv src/schemas/client.schema.ts src/features/clients/schemas/index.ts
```

**Step 3: Move API Routes**
```bash
# Create API directory
mkdir -p src/features/clients/api

# Move API code (keep route.ts in app/api/ but import from feature)
# app/api/client/route.ts will import from features/clients/api
```

**Step 4: Move Database Queries**
```bash
# Create lib directory
mkdir -p src/features/clients/lib

# Move queries
mv src/lib/supabase/client-client.ts src/features/clients/lib/queries.ts
```

**Step 5: Move Components**
```bash
# Create components directory
mkdir -p src/features/clients/components

# Move feature-specific components
# Keep generic components in shared/
```

**Step 6: Move Hooks**
```bash
# Create hooks directory
mkdir -p src/features/clients/hooks

# Move client-specific hooks
```

**Step 7: Move Pages**
```bash
# Create pages directory
mkdir -p src/features/clients/pages

# app/(app)/(clients)/clients/page.tsx content moves here
# But keep thin wrapper in app/ for routing
```

**Step 8: Update All Imports**

Use find and replace:
```bash
# Find all imports from old location
rg "from '@/types/client" -l

# Update to new location
# from '@/types/client.types' → from '@/features/clients/types'
```

**Step 9: Test Thoroughly**
- Run dev server
- Test all client CRUD operations
- Run tests
- Check for TypeScript errors

#### Migration Order (Least to Most Complex)

1. **Dashboard** - Simple, few dependencies
2. **Clients** - Core feature, well-defined
3. **Companies** - Related to clients
4. **Projects** - Moderate complexity
5. **Employees** - HR feature
6. **Auth** - Complex, many dependencies (save for later)

---

### Phase 4: Update App Router (Week 7)

**Goal:** Clean up app/ directory to be minimal routing layer

#### New app/ Structure

```
app/
├── (app)/
│   ├── layout.tsx              # Main layout (uses shared components)
│   ├── page.tsx                # Home page (redirects)
│   │
│   ├── clients/
│   │   └── [[...slug]]/
│   │       └── page.tsx        # Delegates to features/clients/pages
│   │
│   ├── projects/
│   │   └── [[...slug]]/
│   │       └── page.tsx        # Delegates to features/projects/pages
│   │
│   └── ... (other feature routes)
│
├── api/
│   ├── clients/
│   │   ├── route.ts            # Imports from features/clients/api
│   │   └── [id]/
│   │       └── route.ts        # Imports from features/clients/api
│   │
│   └── ... (other API routes)
│
├── auth/
│   ├── signin/
│   │   └── page.tsx            # Imports from features/auth/pages
│   └── signup/
│       └── page.tsx            # Imports from features/auth/pages
│
└── layout.tsx                   # Root layout
```

#### Page Delegation Pattern

**app/clients/[[...slug]]/page.tsx:**
```typescript
import { ClientsPage } from '@/features/clients/pages';

export default ClientsPage;
```

**features/clients/pages/index.tsx:**
```typescript
'use client';

import { ClientList } from '../components/ClientList';
import { useClients } from '../hooks/useClients';

export function ClientsPage() {
  const { clients, isLoading } = useClients();
  
  return (
    <div>
      <h1>Clients</h1>
      <ClientList clients={clients} isLoading={isLoading} />
    </div>
  );
}
```

---

## 👥 Team Collaboration Benefits

### 1. Clear Ownership

Assign features to teams:
- **Team A:** Clients, Companies
- **Team B:** Projects, Employees
- **Team C:** Auth, Dashboard

Each team works in their own feature folders.

### 2. Parallel Development

No more merge conflicts! Teams work independently:

```
src/features/clients/      ← Team A
src/features/projects/     ← Team B
src/features/auth/         ← Team C
```

### 3. Code Review Focused

PRs are scoped to one feature:
```
PR: Add client export functionality
Files changed: features/clients/ only
```

### 4. Onboarding Simplified

New developers:
1. Read feature README
2. All code in one place
3. Clear boundaries

---

## 🧪 Testing Strategy

### Feature-Level Tests

Each feature has complete test coverage:

```
features/clients/__tests__/
├── api.test.ts                 # API endpoint tests
├── components/
│   ├── ClientCard.test.tsx
│   ├── ClientForm.test.tsx
│   └── ClientList.test.tsx
├── lib/
│   ├── queries.test.ts
│   └── mutations.test.ts
└── integration/
    └── clients.e2e.test.ts    # Full feature E2E test
```

### Test Commands

```bash
# Test entire feature
npm test features/clients

# Test all features
npm test features/

# Test shared code
npm test shared/
```

---

## 📊 Migration Checklist

### Pre-Migration
- [ ] Create `features/` and `shared/` directories
- [ ] Set up path aliases in `tsconfig.json`
- [ ] Create feature README templates
- [ ] Document current module dependencies

### Shared Code Migration
- [ ] Move UI components to `shared/components/ui/`
- [ ] Move layout components to `shared/components/layout/`
- [ ] Move error monitoring to `shared/lib/error-monitoring/`
- [ ] Move logger to `shared/lib/logger.ts`
- [ ] Move Supabase client to `shared/lib/supabase/`
- [ ] Move generic hooks to `shared/hooks/`
- [ ] Update all imports to use new paths

### Feature Migration (per feature)
- [ ] Create feature directory structure
- [ ] Move types
- [ ] Move schemas
- [ ] Move API logic
- [ ] Move database queries
- [ ] Move components
- [ ] Move hooks
- [ ] Move pages
- [ ] Create feature README
- [ ] Update all imports
- [ ] Update tests
- [ ] Run feature tests
- [ ] Manual QA testing

### Post-Migration
- [ ] Clean up old directories
- [ ] Update documentation
- [ ] Update onboarding docs
- [ ] Team training on new structure
- [ ] Set up linting rules to enforce boundaries

---

## 🎯 Success Metrics

After refactoring, you should see:

1. **Reduced Merge Conflicts** - 80% reduction
2. **Faster Onboarding** - New devs productive in 2 days vs 1 week
3. **Faster Feature Development** - 30% faster due to less context switching
4. **Better Test Coverage** - Easier to test complete features
5. **Clear Code Ownership** - Each team owns specific features

---

## 🚨 Common Pitfalls to Avoid

### 1. Feature Coupling

**❌ Bad:**
```typescript
// features/projects/components/ProjectCard.tsx
import { ClientCard } from '@/features/clients/components/ClientCard';
```

**✅ Good:**
```typescript
// Move shared logic to shared/
// features/projects/components/ProjectCard.tsx
import { Card } from '@/shared/components/ui/Card';
```

### 2. Shared Code Bloat

**❌ Bad:**
```typescript
// shared/lib/business-logic.ts
export function calculateProjectProfit() {
  // Project-specific logic doesn't belong in shared!
}
```

**✅ Good:**
```typescript
// features/projects/lib/calculations.ts
export function calculateProjectProfit() {
  // Project-specific logic in project feature
}
```

### 3. Over-Engineering

**Good news:** You have 10+ features (clients, companies, projects, employees, payroll, billing, payments, auth, dashboard, documents), so feature-based architecture is **highly appropriate** now.

Avoid:
- Splitting features too granularly (e.g., don't separate "create client" from "clients")
- Creating features for single-use code
- Over-abstracting shared code too early

Keep it practical:
- Group related sub-domains (e.g., `(crm)/` for clients, companies, projects)
- Use route groups for better organization
- Start with obvious feature boundaries

---

## 📚 Additional Resources

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

## 🔄 Migration Safety & Code Cleanup

### During Migration
1. **Keep old code** - Don't delete during migration
2. **Copy, don't move** - Duplicate code initially
3. **Test thoroughly** - Run all tests after each feature migration
4. **Git commits per feature** - Can rollback feature-by-feature

### After Successful Migration
Once a feature is migrated and **all tests pass**:

```bash
# Example: After clients/ migration succeeds
npm test features/clients/        # ✅ All tests pass
npm run test:e2e                  # ✅ E2E tests pass
npm run lint                      # ✅ No errors

# NOW safe to remove old code:
rm -rf src/components/clients/    # Old client components
rm -rf src/lib/supabase/client-*  # Old client queries
rm src/types/client.type.ts       # Old client types
rm src/schemas/client.schema.ts   # Old client schemas
rm src/hooks/useClient.ts         # Old client hooks

git commit -m "chore: remove old clients code after migration"
```

### Rollback Strategy (If Issues Found)

If problems arise **before** cleanup:
1. Revert git commits for that feature
2. Fix issues
3. Re-migrate when ready

**Key principle:** Only delete old code after comprehensive testing validates the migration.

---

## 📝 Documentation Updates Required

After migration:
1. Update [docs/onboarding/FRONTEND.md](docs/onboarding/FRONTEND.md) with new structure
2. Update [docs/onboarding/BACKEND.md](docs/onboarding/BACKEND.md) with new structure
3. Update README.md project structure section
4. Create CONTRIBUTING.md with feature development guide
5. Update ESLint rules to enforce boundaries

---

## Next Steps

1. **Review this plan** with team
2. **Get buy-in** from all developers
3. **Set timeline** (7-8 weeks recommended)
4. **Start with Phase 1** (Preparation)
5. **Migrate incrementally** (one feature per week)

**Estimated Timeline:** 7-8 weeks (1-2 hours/day)  
**Recommended:** Do migration in background while continuing feature development
