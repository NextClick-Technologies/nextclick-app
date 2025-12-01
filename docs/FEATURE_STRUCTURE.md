# Feature-Based Architecture Structure

## Overview

This document describes the new feature-based architecture that clearly separates **backend (domain + data)** from **frontend (UI)** concerns.

## Directory Structure

Each feature follows this structure:

```
feature-name/
├── api/              # BFF Layer - functions used by routes/server actions
│   └── handlers.ts   # Thin HTTP layer that delegates to services
├── services/         # Domain + Data Layer
│   ├── schemas/      # Zod validation schemas
│   ├── types/        # TypeScript types and enums
│   ├── service.ts    # Business logic orchestration
│   └── repository.ts # Data access (database queries)
└── ui/               # Frontend Layer
    ├── components/   # React components
    ├── hooks/        # React hooks (TanStack Query)
    └── pages/        # Page components
```

## Layer Responsibilities

### 1. API Layer (`api/`)

**Purpose:** HTTP request/response handling for Next.js routes and server actions

**Responsibilities:**

- Parse HTTP requests (query params, body)
- Call service layer methods
- Transform responses to HTTP format
- Handle HTTP errors

**Dependencies:**

- ✅ Can import from `services/`
- ❌ Cannot import from `ui/`

**Example:**

```typescript
// api/handlers.ts
import { clientService } from "../services/service";

export async function getClients(request: NextRequest) {
  const { page, pageSize } = parsePagination(request);
  const result = await clientService.getClients({ page, pageSize });
  return apiSuccess(result);
}
```

### 2. Services Layer (`services/`)

#### **A. Schemas (`services/schemas/`)**

**Purpose:** Validation and type safety

**Responsibilities:**

- Define Zod schemas for input validation
- Export TypeScript types derived from schemas
- Define default values and constraints

**Example:**

```typescript
// services/schemas/index.ts
import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  companyId: z.string().uuid(),
});

export type ClientInput = z.input<typeof clientSchema>;
```

#### **B. Types (`services/types/`)**

**Purpose:** Domain type definitions

**Responsibilities:**

- Define TypeScript types and interfaces
- Define enums and constants
- Document data structures

**Example:**

```typescript
// services/types/index.ts
export const ClientStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

export interface Client {
  id: string;
  name: string;
  status: ClientStatus;
}
```

#### **C. Service (`services/service.ts`)**

**Purpose:** Business logic orchestration

**Responsibilities:**

- Implement business rules
- Coordinate repository calls
- Transform data between layers
- Validate inputs using schemas
- Handle business errors

**Dependencies:**

- ✅ Can import from `repository.ts`
- ✅ Can import from `schemas/`
- ✅ Can import from `types/`
- ❌ Cannot import from `api/` or `ui/`

**Example:**

```typescript
// services/service.ts
import { clientRepository } from "./repository";
import { clientSchema } from "./schemas";

export class ClientService {
  async getClients(options: QueryOptions) {
    const { data, error } = await clientRepository.findAll(options);
    if (error) throw new Error(error.message);
    return data;
  }

  async createClient(input: ClientInput) {
    const validated = clientSchema.parse(input);
    return clientRepository.create(validated);
  }
}

export const clientService = new ClientService();
```

#### **D. Repository (`services/repository.ts`)**

**Purpose:** Data access abstraction

**Responsibilities:**

- Execute database queries
- Map database results to domain types
- Handle database errors
- Implement data access patterns

**Dependencies:**

- ✅ Can import from database clients (Supabase, Prisma, etc.)
- ❌ Cannot import from any feature layers

**Example:**

```typescript
// services/repository.ts
import { supabaseAdmin } from "@/lib/supabase/server";

export class ClientRepository {
  async findAll(options: QueryOptions) {
    let query = supabaseAdmin.from("clients").select("*");
    return query.range(offset, limit);
  }

  async findById(id: string) {
    return supabaseAdmin.from("clients").select("*").eq("id", id).single();
  }

  async create(data: DbClientInsert) {
    return supabaseAdmin.from("clients").insert(data).select().single();
  }
}

export const clientRepository = new ClientRepository();
```

### 3. UI Layer (`ui/`)

#### **A. Components (`ui/components/`)**

**Purpose:** Reusable UI components

**Responsibilities:**

- Render UI elements
- Handle user interactions
- Display data passed via props
- Emit events to parent components

**Dependencies:**

- ✅ Can import from `services/types/`
- ✅ Can import from `services/schemas/` (for form validation)
- ✅ Can import from `hooks/`
- ❌ Cannot import from `services/service.ts` or `services/repository.ts`
- ❌ Cannot import from `api/`

**Example:**

```typescript
// ui/components/ClientTable.tsx
import type { Client } from "../../services/types";

export function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <table>
      {clients.map((client) => (
        <tr key={client.id}>
          <td>{client.name}</td>
        </tr>
      ))}
    </table>
  );
}
```

#### **B. Hooks (`ui/hooks/`)**

**Purpose:** Data fetching and state management

**Responsibilities:**

- Fetch data via API routes
- Manage local state
- Handle loading and error states
- Provide mutations for CRUD operations

**Dependencies:**

- ✅ Can import from `services/types/`
- ✅ Can use API client utilities
- ❌ Cannot import from `services/service.ts` (backend-only)
- ❌ Cannot import from `api/handlers.ts` (backend-only)

**Example:**

```typescript
// ui/hooks/index.ts
import { useQuery } from "@tanstack/react-query";
import type { Client } from "../../services/types";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchApi<Client[]>("/api/client"),
  });
}
```

#### **C. Pages (`ui/pages/`)**

**Purpose:** Full page components

**Responsibilities:**

- Compose components into pages
- Fetch data using hooks
- Handle page-level state
- Define page layout

**Dependencies:**

- ✅ Can import from `components/`
- ✅ Can import from `hooks/`
- ✅ Can import from `services/types/`

**Example:**

```typescript
// ui/pages/ClientsPage.tsx
import { ClientTable } from "../components/ClientTable";
import { useClients } from "../hooks";

export function ClientsPage() {
  const { data: clients, isLoading } = useClients();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Clients</h1>
      <ClientTable clients={clients} />
    </div>
  );
}
```

## Import Path Examples

### From API Layer

```typescript
// In api/handlers.ts
import { clientService } from "../services/service";
```

### From Services Layer

```typescript
// In services/service.ts
import { clientRepository } from "./repository";
import { clientSchema } from "./schemas";
import type { Client } from "./types";
```

### From UI Components

```typescript
// In ui/components/ClientTable.tsx
import type { Client } from "../../services/types";
import { useClients } from "../hooks";
```

### From App Routes

```typescript
// In app/(app)/clients/page.tsx
import { ClientsPage } from "@/features/(crm)/clients/ui/pages";
```

### From Tests

```typescript
// In __tests__/unit/client.test.ts
import type { Client } from "@/features/(crm)/clients/services/types";
import { clientSchema } from "@/features/(crm)/clients/services/schemas";
```

## Migration Benefits

### 1. Clear Separation of Concerns

- Backend logic isolated in `services/`
- Frontend logic isolated in `ui/`
- HTTP concerns isolated in `api/`

### 2. Reusability

- Services can be called from:
  - API routes
  - Server actions
  - Background jobs
  - Webhooks
  - CLI tools

### 3. Testability

- Each layer can be tested independently
- Mock one layer to test another
- Clear boundaries make tests simpler

### 4. Scalability

- Easy to add new features following the same pattern
- Team members can work on different layers without conflicts
- Backend and frontend can evolve independently

### 5. Type Safety

- Shared types in `services/types/` used by all layers
- Schemas provide runtime validation
- TypeScript ensures compile-time safety

## Migration Checklist

When creating a new feature:

- [ ] Create directory structure (`api/`, `services/`, `ui/`)
- [ ] Define types in `services/types/`
- [ ] Define schemas in `services/schemas/`
- [ ] Implement repository in `services/repository.ts`
- [ ] Implement service in `services/service.ts`
- [ ] Create API handlers in `api/handlers.ts`
- [ ] Create Next.js routes that use handlers
- [ ] Create UI hooks in `ui/hooks/`
- [ ] Create UI components in `ui/components/`
- [ ] Create page components in `ui/pages/`
- [ ] Export from feature `index.ts`
- [ ] Add tests for each layer

## Existing Features

The following features have been migrated to this structure:

### CRM Domain (`(crm)/`)

- ✅ `clients/` - Client management
- ✅ `companies/` - Company management
- ✅ `projects/` - Project management

### HR Domain (`(hr)/`)

- ✅ `employees/` - Employee management

## Related Documentation

- [BFF Architecture](./BFF_ARCHITECTURE.md) - Detailed BFF pattern explanation
- [API Logic Extraction](./API_LOGIC_EXTRACTION.md) - Phase 3b migration summary
- [Refactoring Plan](./REFACTORING_PLAN.md) - Overall refactoring strategy
