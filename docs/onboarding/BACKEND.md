# Backend Development Guide

**Prerequisites:** Complete the [General Onboarding](README.md) first.

This guide is specifically for **backend developers** working on APIs, database, and server-side logic of Next Click ERP.

## 📋 Table of Contents

- [Backend Architecture](#-backend-architecture)
- [Tech Stack Deep Dive](#-tech-stack-deep-dive)
- [API Development](#-api-development)
- [Database Operations](#-database-operations)
- [Authentication & Authorization](#-authentication--authorization)
- [Error Handling & Logging](#-error-handling--logging)
- [Common Tasks](#-common-tasks)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Backend Architecture

We use a **feature-based architecture with BFF (Backend For Frontend)** pattern where business logic lives in feature modules, and API routes are thin delegates.

### Directory Structure

```
src/
├── app/api/                  # API Routes (thin routing layer)
│   ├── auth/                 # Auth API delegates
│   │   ├── [...nextauth]/route.ts  # → features/auth/api
│   │   ├── create-user/route.ts    # → features/auth/api
│   │   ├── verify-email/route.ts   # → features/auth/api
│   │   └── reset-password/route.ts # → features/auth/api
│   ├── client/               # Client API delegates
│   │   ├── route.ts          # → features/clients/api/handlers
│   │   └── [id]/route.ts     # → features/clients/api/handlers
│   ├── project/              # Project API delegates
│   │   ├── route.ts          # → features/projects/api/handlers
│   │   ├── [id]/route.ts     # → features/projects/api/handlers
│   │   └── [id]/teams/       # → features/projects/api/handlers
│   ├── employee/             # Employee API delegates
│   └── webhooks/             # Webhook handlers
│
├── features/                 # ⭐ Feature modules (business logic here!)
│   ├── clients/
│   │   ├── api/              # API handlers (business logic)
│   │   │   └── handlers.ts   # Actual GET/POST/PUT/DELETE implementation
│   │   └── domain/         # Business logic layer
│   │       ├── repository.ts # Database queries (Supabase)
│   │       ├── service.ts    # Business operations
│   │       ├── schemas/      # Zod validation schemas
│   │       │   └── client.schema.ts
│   │       └── types/        # TypeScript types
│   │           └── client.type.ts
│   │
│   ├── projects/             # Project feature (same structure)
│   │   ├── api/handlers.ts
│   │   └── domain/
│   │       ├── repository.ts
│   │       ├── service.ts
│   │       ├── schemas/
│   │       └── types/
│   │
│   ├── employees/            # Employee feature (same structure)
│   ├── companies/            # Company feature (same structure)
│   ├── auth/                 # Auth feature (same structure)
│   ├── milestone/            # Milestone feature
│   ├── payment/              # Payment feature
│   └── communication-log/    # Communication log feature
│
└── shared/                   # Truly shared code
    ├── lib/                  # Shared utilities
    │   ├── api/              # API utilities
    │   │   ├── client.ts     # API client (fetchApi, createApi, etc.)
    │   │   └── api-utils.ts  # Response helpers (apiSuccess, apiError)
    │   ├── supabase/         # Database client
    │   │   ├── server.ts     # Server-side client
    │   │   ├── client.ts     # Client-side client
    │   │   └── migrations/   # SQL migrations
    │   ├── auth/             # Auth utilities
    │   │   ├── index.ts      # NextAuth config
    │   │   └── password.ts   # Password hashing
    │   ├── email/            # Email sending
    │   ├── logger.ts         # Pino structured logging
    │   └── error-monitoring/ # Error tracking
    │       ├── handler.ts    # Error classification
    │       ├── api-wrapper.ts # API error wrapper
    │       ├── discord.ts    # Discord notifications
    │       ├── jira.ts       # Jira integration
    │       └── supabase.ts   # Error logging
    ├── types/                # Global types
    │   └── database.type.ts  # Database schema types
    └── schemas/              # Global schemas
        ├── pagination.schema.ts
        └── user.schema.ts
```

### Key Architecture Principles

#### 1. **BFF (Backend For Frontend) Pattern**

API routes (`app/api/`) are thin delegates that just route to feature handlers:

```typescript
// app/api/client/route.ts (THIN DELEGATE - just routing)
import { getClients, createClient } from "@/features/clients/api/handlers";

export const GET = getClients; // Just delegates
export const POST = createClient; // Just delegates
```

```typescript
// features/clients/api/handlers.ts (BUSINESS LOGIC - actual implementation)
import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
} from "@/shared/lib/api/api-utils";
import * as clientService from "../domain/service";

export async function getClients(request: NextRequest) {
  try {
    // Extract query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // Business logic
    const result = await clientService.getAllClients({ page, pageSize });

    // Return response
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createClient(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientService.createClient(body);
    return apiSuccess(client, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### 2. **Three-Layer Architecture per Feature**

Each feature has three distinct layers:

**Layer 1: API Handlers** (`features/[feature]/api/handlers.ts`)

- HTTP request/response handling
- Request validation
- Error responses
- Calls service layer

**Layer 2: Service Layer** (`features/[feature]/domain/service.ts`)

- Business logic
- Data transformation
- Validation with Zod schemas
- Calls repository layer

**Layer 3: Repository Layer** (`features/[feature]/domain/repository.ts`)

- Database queries (Supabase)
- Raw data access
- Query building
- Returns database results

```typescript
// Layer 3: Repository (Database Access)
// features/clients/domain/repository.ts
export async function findAllClients(options: QueryOptions) {
  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("*")
    .range(options.offset, options.offset + options.limit - 1);

  if (error) throw error;
  return data;
}

// Layer 2: Service (Business Logic)
// features/clients/domain/service.ts
export async function getAllClients(options: QueryOptions) {
  // Validate input
  const validated = querySchema.parse(options);

  // Get data from repository
  const clients = await repository.findAllClients(validated);

  // Transform data (snake_case → camelCase)
  return clients.map(transformFromDb);
}

// Layer 1: API Handler (HTTP Layer)
// features/clients/api/handlers.ts
export async function getClients(request: NextRequest) {
  try {
    const options = extractQueryParams(request);
    const result = await clientService.getAllClients(options);
    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
```

#### 3. **Feature Independence**

Features are self-contained vertical slices:

```
features/clients/
├── api/           # HTTP layer
├── domain/      # Business logic
│   ├── repository.ts  # Data access
│   ├── service.ts     # Business operations
│   ├── schemas/       # Validation
│   └── types/         # Types
└── ui/            # Frontend (if needed)
```

**Import Rules:**

```typescript
// ✅ ALLOWED: Feature imports from shared
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { apiSuccess } from "@/shared/lib/api/api-utils";

// ✅ ALLOWED: Feature imports its own code
import * as clientService from "../domain/service";
import { clientSchema } from "../domain/schemas";

// ❌ NOT ALLOWED: Feature imports from another feature
import { projectService } from "@/features/projects/domain/service";
// If needed, create a shared service!
```

#### 4. **Proper HTTP Status Codes**

All API handlers return proper status codes:

```typescript
// 200 OK - Successful GET
return apiSuccess({ data: clients });

// 201 Created - Successful POST
return apiSuccess(newClient, 201);

// 204 No Content - Successful DELETE (no body!)
return new Response(null, { status: 204 });

// 400 Bad Request - Validation error
return apiError("Invalid input", 400, validationErrors);

// 404 Not Found - Resource not found
return apiError("Client not found", 404);

// 500 Internal Server Error - Server error
return handleApiError(error);
```

## 🚀 Working with Features (BFF Pattern)

### Feature Structure Deep Dive

Every feature follows a three-layer architecture. Let's use `clients` as an example:

```
features/clients/
├── api/                          # Layer 1: HTTP/API Layer
│   └── handlers.ts               # Request handling, response formatting
├── domain/                     # Layer 2 & 3: Business + Data Layer
│   ├── service.ts                # Business logic, validation
│   ├── repository.ts             # Database queries (Supabase)
│   ├── schemas/                  # Zod validation schemas
│   │   └── client.schema.ts
│   └── types/                    # TypeScript types
│       └── client.type.ts
└── ui/                           # Frontend (if applicable)
```

### Layer 1: API Handlers

**Purpose:** Handle HTTP requests and responses

**Location:** `features/[feature]/api/handlers.ts`

**Responsibilities:**

- Parse request (query params, body)
- Call service layer
- Format responses (apiSuccess, apiError)
- Handle errors

**Example:**

```typescript
// features/clients/api/handlers.ts
import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
} from "@/shared/lib/api/api-utils";
import * as clientService from "../domain/service";

export async function getClients(request: NextRequest) {
  try {
    // 1. Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || undefined;

    // 2. Call service layer
    const result = await clientService.getAllClients({
      page,
      pageSize,
      search,
    });

    // 3. Return success response
    return apiSuccess(result);
  } catch (error) {
    // 4. Handle errors
    return handleApiError(error);
  }
}

export async function getClientById(id: string) {
  try {
    const client = await clientService.getClientById(id);

    if (!client) {
      return apiError("Client not found", 404);
    }

    return apiSuccess(client);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createClient(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientService.createClient(body);
    return apiSuccess(client, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateClient(id: string, request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientService.updateClient(id, body);
    return apiSuccess(client);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteClient(id: string) {
  try {
    await clientService.deleteClient(id);
    // 204 No Content - no response body!
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Layer 2: Service Layer

**Purpose:** Business logic and validation

**Location:** `features/[feature]/domain/service.ts`

**Responsibilities:**

- Validate input with Zod schemas
- Business logic and rules
- Data transformation (camelCase ↔ snake_case)
- Call repository layer
- Orchestrate multiple operations

**Example:**

```typescript
// features/clients/domain/service.ts
import { transformToDb, transformFromDb } from "@/shared/lib/api/api-utils";
import { clientSchema, updateClientSchema } from "./schemas/client.schema";
import * as clientRepository from "./repository";
import type { ClientQueryOptions } from "./repository";

export async function getAllClients(options: ClientQueryOptions) {
  // 1. Validate query options (optional)
  const validated = {
    page: options.page || 1,
    pageSize: Math.min(options.pageSize || 10, 100), // Max 100
    search: options.search,
  };

  // 2. Get data from repository
  const { data, total } = await clientRepository.findAllClients(validated);

  // 3. Transform data (snake_case → camelCase)
  const transformedData = data.map(transformFromDb);

  // 4. Return formatted response
  return {
    data: transformedData,
    pagination: {
      page: validated.page,
      pageSize: validated.pageSize,
      total,
      totalPages: Math.ceil(total / validated.pageSize),
    },
  };
}

export async function getClientById(id: string) {
  const client = await clientRepository.findClientById(id);
  return client ? transformFromDb(client) : null;
}

export async function createClient(input: unknown) {
  // 1. Validate input
  const validated = clientSchema.parse(input);

  // 2. Transform to database format
  const dbData = transformToDb(validated);

  // 3. Create in database
  const client = await clientRepository.createClient(dbData);

  // 4. Transform and return
  return transformFromDb(client);
}

export async function updateClient(id: string, input: unknown) {
  // 1. Validate input
  const validated = updateClientSchema.parse(input);

  // 2. Check if exists
  const exists = await clientRepository.findClientById(id);
  if (!exists) {
    throw new Error("Client not found");
  }

  // 3. Transform to database format
  const dbData = transformToDb(validated);

  // 4. Update in database
  const client = await clientRepository.updateClient(id, dbData);

  // 5. Transform and return
  return transformFromDb(client);
}

export async function deleteClient(id: string) {
  // 1. Check if exists
  const exists = await clientRepository.findClientById(id);
  if (!exists) {
    throw new Error("Client not found");
  }

  // 2. Delete from database
  await clientRepository.deleteClient(id);
}
```

### Layer 3: Repository Layer

**Purpose:** Direct database access

**Location:** `features/[feature]/domain/repository.ts`

**Responsibilities:**

- Supabase queries
- Raw data access
- Query building
- Return database results (no transformation)

**Example:**

```typescript
// features/clients/domain/repository.ts
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export interface ClientQueryOptions {
  page: number;
  pageSize: number;
  search?: string;
}

export async function findAllClients(options: ClientQueryOptions) {
  const { page, pageSize, search } = options;
  const offset = (page - 1) * pageSize;

  // Build query
  let query = supabaseAdmin.from("clients").select("*", { count: "exact" });

  // Add search filter
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  // Add pagination
  query = query
    .range(offset, offset + pageSize - 1)
    .order("created_at", { ascending: false });

  // Execute query
  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
  };
}

export async function findClientById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createClient(client: any) {
  const { data, error } = await supabaseAdmin
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await supabaseAdmin.from("clients").delete().eq("id", id);

  if (error) throw error;
}
```

### Creating API Route Delegates

API routes in `app/api/` just delegate to feature handlers:

```typescript
// app/api/client/route.ts
import { getClients, createClient } from "@/features/clients/api/handlers";

export const GET = getClients;
export const POST = createClient;
```

```typescript
// app/api/client/[id]/route.ts
import {
  getClientById,
  updateClient,
  deleteClient,
} from "@/features/clients/api/handlers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getClientById(id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateClient(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteClient(id);
}
```

### Adding a New Backend Feature

Let's create a "Tasks" feature step-by-step:

**1. Create feature structure:**

```bash
mkdir -p src/features/tasks/{api,domain/{schemas,types}}
```

**2. Define types:**

```typescript
// features/tasks/domain/types/task.type.ts
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**3. Create validation schemas:**

```typescript
// features/tasks/domain/schemas/task.schema.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  assigneeId: z.string().uuid().optional(),
});

export const updateTaskSchema = taskSchema.partial();

export type CreateTaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
```

**4. Create repository:**

```typescript
// features/tasks/domain/repository.ts
import { supabaseAdmin } from "@/shared/lib/supabase/server";

export async function findAllTasks() {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function findTaskById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createTask(task: any) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabaseAdmin.from("tasks").delete().eq("id", id);

  if (error) throw error;
}
```

**5. Create service:**

```typescript
// features/tasks/domain/service.ts
import { transformFromDb, transformToDb } from "@/shared/lib/api/api-utils";
import { taskSchema, updateTaskSchema } from "./schemas/task.schema";
import * as taskRepository from "./repository";

export async function getAllTasks() {
  const tasks = await taskRepository.findAllTasks();
  return { data: tasks.map(transformFromDb) };
}

export async function getTaskById(id: string) {
  const task = await taskRepository.findTaskById(id);
  return task ? transformFromDb(task) : null;
}

export async function createTask(input: unknown) {
  const validated = taskSchema.parse(input);
  const dbData = transformToDb(validated);
  const task = await taskRepository.createTask(dbData);
  return transformFromDb(task);
}

export async function updateTask(id: string, input: unknown) {
  const validated = updateTaskSchema.parse(input);

  const exists = await taskRepository.findTaskById(id);
  if (!exists) {
    throw new Error("Task not found");
  }

  const dbData = transformToDb(validated);
  const task = await taskRepository.updateTask(id, dbData);
  return transformFromDb(task);
}

export async function deleteTask(id: string) {
  const exists = await taskRepository.findTaskById(id);
  if (!exists) {
    throw new Error("Task not found");
  }

  await taskRepository.deleteTask(id);
}
```

**6. Create API handlers:**

```typescript
// features/tasks/api/handlers.ts
import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
} from "@/shared/lib/api/api-utils";
import * as taskService from "../domain/service";

export async function getTasks(request: NextRequest) {
  try {
    const tasks = await taskService.getAllTasks();
    return apiSuccess(tasks);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getTaskById(id: string) {
  try {
    const task = await taskService.getTaskById(id);

    if (!task) {
      return apiError("Task not found", 404);
    }

    return apiSuccess(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createTask(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await taskService.createTask(body);
    return apiSuccess(task, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateTask(id: string, request: NextRequest) {
  try {
    const body = await request.json();
    const task = await taskService.updateTask(id, body);
    return apiSuccess(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteTask(id: string) {
  try {
    await taskService.deleteTask(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

**7. Create API routes:**

```typescript
// app/api/task/route.ts
import { getTasks, createTask } from "@/features/tasks/api/handlers";

export const GET = getTasks;
export const POST = createTask;
```

```typescript
// app/api/task/[id]/route.ts
import {
  getTaskById,
  updateTask,
  deleteTask,
} from "@/features/tasks/api/handlers";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return getTaskById(id);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return updateTask(id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteTask(id);
}
```

Done! Your new backend feature is complete.

### API Route Anatomy (Old Pattern - For Reference)

```typescript
// src/app/api/client/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withErrorMonitoring } from "@/lib/error-monitoring/api-wrapper";
import { auth } from "@/lib/auth";
import { z } from "zod";

// GET /api/client
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  // 1. Authentication check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Business logic
  const clients = await getClients();

  // 3. Return response
  return NextResponse.json({ data: clients });
});

// POST /api/client
export const POST = withErrorMonitoring(async (req: NextRequest) => {
  // 1. Authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validation
  const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  });

  const body = await req.json();
  const validated = schema.parse(body);

  // 3. Database operation
  const client = await createClient(validated);

  // 4. Return response
  return NextResponse.json({ data: client }, { status: 201 });
});
```

## 🛠️ Tech Stack Deep Dive

### Next.js API Routes

**Serverless functions:**

- Each route file is a separate serverless function
- Deployed to Vercel Edge Network
- Auto-scaled on demand
- Cold start considerations

**HTTP methods:**

```typescript
export const GET = async (req: NextRequest) => {
  /* ... */
};
export const POST = async (req: NextRequest) => {
  /* ... */
};
export const PUT = async (req: NextRequest) => {
  /* ... */
};
export const PATCH = async (req: NextRequest) => {
  /* ... */
};
export const DELETE = async (req: NextRequest) => {
  /* ... */
};
```

**Dynamic routes:**

```typescript
// src/app/api/client/[id]/route.ts
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const clientId = params.id;
  // ...
};
```

### Supabase (PostgreSQL)

**Server-side client:**

```typescript
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
```

**Basic queries:**

```typescript
// SELECT
const { data, error } = await supabase.from("clients").select("*");

// SELECT with filter
const { data } = await supabase
  .from("clients")
  .select("*")
  .eq("status", "active")
  .order("created_at", { ascending: false });

// INSERT
const { data, error } = await supabase
  .from("clients")
  .insert({ name: "John", email: "john@example.com" })
  .select()
  .single();

// UPDATE
const { data, error } = await supabase
  .from("clients")
  .update({ name: "Jane" })
  .eq("id", clientId)
  .select()
  .single();

// DELETE
const { error } = await supabase.from("clients").delete().eq("id", clientId);
```

### Input Validation (Zod)

```typescript
import { z } from "zod";

// Define schema
const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

// Validate input
const body = await req.json();
const validated = createClientSchema.parse(body); // Throws if invalid

// Or with safeParse (no throw)
const result = createClientSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json({ error: result.error.format() }, { status: 400 });
}
```

### Structured Logging (Pino)

```typescript
import { logger } from "@/lib/logger";

// Log levels
logger.info({ userId: session.user.id }, "User logged in");
logger.warn({ clientId }, "Client not found");
logger.error({ error: err.message }, "Failed to create client");
logger.debug({ data }, "Debug info");

// Logs are JSON format for easy parsing
// {"level":"info","time":1234567890,"userId":"123","msg":"User logged in"}
```

## 🔌 API Development

### Creating a New API Endpoint

1. **Create route file:**

```typescript
// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withErrorMonitoring } from "@/lib/error-monitoring/api-wrapper";
import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  status: z.enum(["todo", "in_progress", "done"]),
  assignee_id: z.string().uuid().optional(),
});

// GET /api/tasks
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error({ error }, "Failed to fetch tasks");
    throw error;
  }

  return NextResponse.json({ data: tasks });
});

// POST /api/tasks
export const POST = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate input
  const body = await req.json();
  const validated = taskSchema.parse(body);

  // Create task
  const supabase = await createClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      ...validated,
      created_by: session.user.id,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error }, "Failed to create task");
    throw error;
  }

  logger.info({ taskId: task.id }, "Task created successfully");

  return NextResponse.json({ data: task }, { status: 201 });
});
```

2. **Create type definition:**

```typescript
// src/types/task.types.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  assignee_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type CreateTaskInput = Omit<
  Task,
  "id" | "created_by" | "created_at" | "updated_at"
>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
```

### Error Responses

```typescript
// 400 Bad Request - Invalid input
return NextResponse.json({ error: "Invalid email format" }, { status: 400 });

// 401 Unauthorized - No authentication
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// 403 Forbidden - No permission
return NextResponse.json(
  { error: "You do not have permission to access this resource" },
  { status: 403 }
);

// 404 Not Found
return NextResponse.json({ error: "Client not found" }, { status: 404 });

// 500 Internal Server Error
return NextResponse.json({ error: "Internal server error" }, { status: 500 });
```

## 💾 Database Operations

### Query Functions Pattern

Create reusable query functions in `lib/supabase/`:

```typescript
// src/lib/supabase/client-queries.ts
import { createClient } from "./server";
import type {
  Client,
  CreateClientInput,
  UpdateClientInput,
} from "@/types/client.types";

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(
  id: string,
  input: UpdateClientInput
): Promise<Client> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw error;
}
```

### Database Migrations

1. **Create migration file:**

```sql
-- src/lib/supabase/migrations/20251201_create_tasks_table.sql

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo',
  assignee_id UUID REFERENCES auth.users(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Add comment
COMMENT ON TABLE tasks IS 'User tasks and todos';
```

2. **Run in Supabase SQL Editor**

## 🔐 Authentication & Authorization

### Checking Authentication

```typescript
import { auth } from "@/lib/auth";

export const GET = withErrorMonitoring(async (req: NextRequest) => {
  // Get session
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Access user data
  const userId = session.user.id;
  const userEmail = session.user.email;

  // Your logic here
});
```

### Role-Based Access Control

```typescript
export const DELETE = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has admin role
  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admin access required" },
      { status: 403 }
    );
  }

  // Admin-only logic here
});
```

## 🚨 Error Handling & Logging

### Error Monitoring Wrapper

**Always use `withErrorMonitoring`:**

```typescript
import { withErrorMonitoring } from "@/lib/error-monitoring/api-wrapper";

// This wrapper:
// - Catches all errors
// - Logs to Supabase
// - Sends Discord notifications (critical/high)
// - Creates Jira tickets (medium+)
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  // Your code here
  // Any errors will be automatically monitored
});
```

### Structured Logging

```typescript
import { logger } from "@/lib/logger";

// Good logging practices
logger.info(
  { userId: session.user.id, action: "create_client" },
  "Client created successfully"
);

logger.warn(
  { clientId, requestedBy: session.user.id },
  "Attempted to access non-existent client"
);

logger.error(
  {
    error: error.message,
    stack: error.stack,
    context: { userId, action: "update_client" },
  },
  "Failed to update client"
);

// Never use console.log in production!
// ❌ console.log('Client created');  // Don't do this
// ✅ logger.info({ clientId }, 'Client created');  // Do this
```

## 🔧 Common Tasks

### Add CRUD Endpoints

```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withErrorMonitoring } from "@/lib/error-monitoring/api-wrapper";
import { auth } from "@/lib/auth";
import * as queries from "@/lib/supabase/resource-queries";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  // ... other fields
});

// List all
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await queries.getAll();
  return NextResponse.json({ data: items });
});

// Create new
export const POST = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const validated = schema.parse(body);

  const item = await queries.create(validated);
  return NextResponse.json({ data: item }, { status: 201 });
});

// src/app/api/resource/[id]/route.ts

// Get by ID
export const GET = withErrorMonitoring(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const item = await queries.getById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: item });
  }
);

// Update
export const PUT = withErrorMonitoring(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = schema.partial().parse(body);

    const item = await queries.update(params.id, validated);
    return NextResponse.json({ data: item });
  }
);

// Delete
export const DELETE = withErrorMonitoring(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await queries.remove(params.id);
    return NextResponse.json({ success: true });
  }
);
```

### Send Email

```typescript
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: user.email,
  subject: "Welcome to Next Click",
  template: "welcome",
  data: {
    name: user.name,
    verificationLink: `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`,
  },
});
```

## ✅ Best Practices

### Security

- **Always validate input** - Use Zod schemas
- **Check authentication first** - Before any business logic
- **Use RLS policies** - Row Level Security in Supabase
- **Sanitize output** - Don't expose sensitive data
- **Rate limiting** - Consider for public endpoints

### Performance

- **Use database indexes** - For frequently queried columns
- **Avoid N+1 queries** - Use joins or batch queries
- **Cache when appropriate** - For static or slow-changing data
- **Optimize queries** - Select only needed columns

### Code Quality

- **Type everything** - No `any` types
- **Extract to functions** - Keep routes thin
- **Write tests** - For critical business logic
- **Document complex logic** - Add comments

## 🐛 Troubleshooting

**Supabase connection errors:**

- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Ensure using server-side client
- Verify RLS policies allow the operation

**Authentication issues:**

- Check `NEXTAUTH_SECRET` is set
- Verify session cookie is being sent
- Check middleware configuration

**Validation errors:**

- Review Zod schema carefully
- Check error messages: `error.format()`
- Test with Postman/Insomnia first

---

**Ready to build robust APIs! 🚀**
