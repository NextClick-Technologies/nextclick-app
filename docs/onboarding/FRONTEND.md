# Frontend Development Guide

**Prerequisites:** Complete the [General Onboarding](README.md) first.

This guide is specifically for **frontend developers** working on the UI and user experience of Next Click ERP.

## 📋 Table of Contents

- [Frontend Architecture](#-frontend-architecture)
- [Tech Stack Deep Dive](#-tech-stack-deep-dive)
- [Component Development](#-component-development)
- [Styling Guide](#-styling-guide)
- [State Management](#-state-management)
- [Forms & Validation](#-forms--validation)
- [Common Tasks](#-common-tasks)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Frontend Architecture

We use a **feature-based architecture** where all code related to a feature lives together in one place.

### Directory Structure

```
src/
├── app/                        # Next.js App Router (minimal routing layer)
│   ├── (pages)/            # Route group for all features
│   │   ├── auth/              # Auth pages
│   │   │   ├── signin/page.tsx
│   │   │   ├── signout/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── clients/           # Client pages
│   │   │   ├── page.tsx       # /clients
│   │   │   └── [id]/page.tsx  # /clients/[id]
│   │   ├── companies/         # Company pages
│   │   ├── projects/          # Project pages
│   │   ├── employees/         # Employee pages
│   │   ├── dashboard/         # Dashboard page
│   │   └── ...                # Other feature pages
│   ├── api/                   # API route delegates (BFF pattern)
│   │   ├── client/
│   │   │   ├── route.ts       # → delegates to features/clients/api
│   │   │   └── [id]/route.ts
│   │   ├── project/
│   │   ├── employee/
│   │   └── ...
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home redirect
│
├── features/                  # ⭐ Feature modules (everything lives here!)
│   ├── clients/               # Client feature (vertical slice)
│   │   ├── api/               # API handlers (business logic)
│   │   │   └── handlers.ts    # GET/POST/PUT/DELETE logic
│   │   ├── domain/          # Business logic layer
│   │   │   ├── repository.ts  # Database queries
│   │   │   ├── service.ts     # Business operations
│   │   │   ├── schemas/       # Zod validation
│   │   │   │   └── client.schema.ts
│   │   │   └── types/         # TypeScript types
│   │   │       └── client.type.ts
│   │   └── ui/                # UI layer
│   │       ├── components/    # Feature-specific components
│   │       │   ├── ClientCard.tsx
│   │       │   ├── ClientForm.tsx
│   │       │   └── ClientList.tsx
│   │       ├── hooks/         # Feature-specific hooks
│   │       │   └── useClient.ts
│   │       └── pages/         # Page components
│   │           └── ClientDetailPage.tsx
│   │
│   ├── projects/              # Project feature (same structure)
│   ├── employees/             # Employee feature (same structure)
│   ├── companies/             # Company feature (same structure)
│   ├── auth/                  # Auth feature (same structure)
│   ├── dashboard/             # Dashboard feature (same structure)
│   └── ...                    # Other features
│
└── shared/                    # Truly shared code (used across features)
    ├── components/            # Generic UI components
    │   ├── ui/                # Shadcn components (Button, Input, etc.)
    │   ├── layout/            # Layout components (Header, Sidebar)
    │   ├── ErrorBoundary.tsx
    │   └── ThemeProvider.tsx
    ├── lib/                   # Shared utilities
    │   ├── api/               # API client utilities
    │   ├── supabase/          # Database client
    │   ├── logger.ts          # Logging
    │   └── error-monitoring/  # Error tracking
    ├── hooks/                 # Generic hooks
    │   ├── useDebounce.ts
    │   └── useLocalStorage.ts
    ├── contexts/              # React contexts
    │   ├── AuthContext.tsx
    │   └── SidebarContext.tsx
    ├── providers/             # React providers
    │   └── AppProviders.tsx
    ├── types/                 # Global types
    │   └── database.type.ts
    └── utils/                 # Utility functions
        └── cn.ts
```

### Key Architecture Principles

#### 1. **Feature-Based Organization**

Everything related to a feature lives in its feature folder:

- `features/clients/` contains ALL client-related code
- `features/projects/` contains ALL project-related code
- No more hunting across `components/`, `lib/`, `hooks/`, `types/`

#### 2. **Vertical Slices**

Each feature is a complete vertical slice from UI to database:

```
features/clients/
├── ui/           # What users see
├── domain/     # Business logic
└── api/          # API endpoints
```

#### 3. **BFF Pattern (Backend For Frontend)**

API routes in `app/api/` are thin delegates to feature handlers:

```typescript
// app/api/client/route.ts (thin delegate)
import { getClients, createClient } from "@/features/clients/api/handlers";

export const GET = getClients; // Just delegates
export const POST = createClient; // Just delegates
```

```typescript
// features/clients/api/handlers.ts (actual implementation)
export async function getClients(req: NextRequest) {
  // All business logic here
  const clients = await clientService.getAllClients();
  return apiSuccess({ data: clients });
}
```

#### 4. **Import Rules**

```typescript
// ✅ ALLOWED: Feature imports from shared
import { Button } from "@/shared/components/ui/button";

// ✅ ALLOWED: Feature imports its own code
import { ClientCard } from "../components/ClientCard";

// ❌ NOT ALLOWED: Feature imports from another feature
import { ProjectCard } from "@/features/projects/ui/components/ProjectCard";
// If needed, move to shared!

// ❌ NOT ALLOWED: Shared imports from features
import { ClientCard } from "@/features/clients/ui/components/ClientCard";
```

### Page vs Component

**Pages** (in `app/(pages)/`):

- Thin wrappers that delegate to feature pages
- Handle routing only
- Import from `features/[feature]/ui/pages/`

**Feature Pages** (in `features/[feature]/ui/pages/`):

- Actual page implementation
- Compose feature components
- Use feature hooks for data

**Components** (in `features/[feature]/ui/components/`):

- Feature-specific UI pieces
- Only used within that feature

**Shared Components** (in `shared/components/`):

- Generic, reusable across features
- No feature-specific logic

## 🚀 Working with Features

### Anatomy of a Feature

Every feature follows the same structure. Let's use `clients` as an example:

```
features/clients/
├── api/                          # Backend logic
│   └── handlers.ts               # API endpoint handlers
├── domain/                     # Business logic
│   ├── repository.ts             # Database queries
│   ├── service.ts                # Business operations
│   ├── schemas/                  # Zod validation
│   │   └── client.schema.ts
│   └── types/                    # TypeScript types
│       └── client.type.ts
└── ui/                           # Frontend logic
    ├── components/               # UI components
    │   ├── ClientCard.tsx
    │   ├── ClientForm.tsx
    │   ├── ClientList.tsx
    │   └── AddClientDialog.tsx
    ├── hooks/                    # Data fetching hooks
    │   └── useClient.ts
    └── pages/                    # Page components
        ├── ClientsPage.tsx
        └── ClientDetailPage.tsx
```

### Creating a New Feature Component

**Step 1: Create the component file**

```bash
# Always create in features/[feature]/ui/components/
touch src/features/clients/ui/components/ClientCard.tsx
```

**Step 2: Build the component**

```tsx
// features/clients/ui/components/ClientCard.tsx
"use client";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Client } from "../../domain/types/client.type";

interface ClientCardProps {
  client: Client;
  onEdit?: (client: Client) => void;
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">{client.name}</h3>
      <p className="text-sm text-muted-foreground">{client.email}</p>
      {onEdit && <Button onClick={() => onEdit(client)}>Edit</Button>}
    </Card>
  );
}
```

**Step 3: Use in feature page**

```tsx
// features/clients/ui/pages/ClientsPage.tsx
"use client";

import { ClientCard } from "../components/ClientCard";
import { useClients } from "../hooks/useClient";

export function ClientsPage() {
  const { data } = useClients();
  const clients = data?.data || [];

  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

### Creating a Feature Hook

Feature hooks handle data fetching and mutations using TanStack Query:

```tsx
// features/clients/ui/hooks/useClient.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchApi,
  createApi,
  updateApi,
  deleteApi,
} from "@/shared/lib/api/client";
import type { Client } from "../../domain/types/client.type";
import type { CreateClientInput } from "../../domain/schemas/client.schema";

// Fetch all clients
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: () => fetchApi<Client>("client"),
  });
}

// Fetch single client
export function useClient(id: string | null) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => fetchByIdApi<Client>("client", id!),
    enabled: !!id,
  });
}

// Create client
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientInput) =>
      createApi<Client, CreateClientInput>("client", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// Update client
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      updateApi<Client, Partial<Client>>("client", id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

// Delete client
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteApi("client", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
```

### Adding a New Feature (Step-by-Step)

Let's say you need to add a "Tasks" feature:

**1. Create feature directory structure:**

```bash
mkdir -p src/features/tasks/{api,services/{schemas,types},ui/{components,hooks,pages}}
```

**2. Create types:**

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

**3. Create schemas:**

```typescript
// features/tasks/domain/schemas/task.schema.ts
import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  assigneeId: z.string().uuid().optional(),
});

export type CreateTaskInput = z.infer<typeof taskSchema>;
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
```

**5. Create service:**

```typescript
// features/tasks/domain/service.ts
import { transformFromDb, transformToDb } from "@/shared/lib/api/api-utils";
import { taskSchema } from "./schemas/task.schema";
import * as taskRepository from "./repository";

export async function getAllTasks() {
  const tasks = await taskRepository.findAllTasks();
  return tasks.map(transformFromDb);
}

export async function createTask(input: unknown) {
  const validated = taskSchema.parse(input);
  const task = await taskRepository.createTask(transformToDb(validated));
  return transformFromDb(task);
}
```

**6. Create API handlers:**

```typescript
// features/tasks/api/handlers.ts
import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/shared/lib/api/api-utils";
import * as taskService from "../domain/service";

export async function getTasks(request: NextRequest) {
  try {
    const tasks = await taskService.getAllTasks();
    return apiSuccess({ data: tasks });
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
```

**7. Create API route delegates:**

```typescript
// app/api/task/route.ts
import { getTasks, createTask } from "@/features/tasks/api/handlers";

export const GET = getTasks;
export const POST = createTask;
```

**8. Create hooks:**

```typescript
// features/tasks/ui/hooks/useTask.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi, createApi } from "@/shared/lib/api/client";
import type { Task } from "../../domain/types/task.type";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchApi<Task>("task"),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => createApi<Task, any>("task", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
```

**9. Create components:**

```typescript
// features/tasks/ui/components/TaskCard.tsx
"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Task } from "../../domain/types/task.type";

export function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="p-4">
      <h3>{task.title}</h3>
      <Badge>{task.status}</Badge>
    </Card>
  );
}
```

**10. Create page:**

```typescript
// features/tasks/ui/pages/TasksPage.tsx
"use client";

import { TaskCard } from "../components/TaskCard";
import { useTasks } from "../hooks/useTask";

export function TasksPage() {
  const { data, isLoading } = useTasks();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.data.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

**11. Add app route:**

```typescript
// app/(pages)/tasks/page.tsx
import { TasksPage } from "@/features/tasks/ui/pages/TasksPage";

export default TasksPage;
```

Done! Your new feature is complete and follows the architecture.

## 🛠️ Tech Stack Deep Dive

### Next.js 16 App Router

**Server Components (default):**

```tsx
// This runs on the server
export default async function ClientsPage() {
  const clients = await getClients(); // Server-side data fetching

  return (
    <div>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

**Client Components (interactive):**

```tsx
"use client"; // This directive makes it a Client Component

import { useState } from "react";

export function ClientForm() {
  const [name, setName] = useState("");

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </form>
  );
}
```

**When to use Client Components:**

- React hooks (`useState`, `useEffect`, custom hooks)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `localStorage`, `navigator`)
- Third-party libraries that use client features

### Tailwind CSS v4

**Utility-first CSS:**

```tsx
<div className="flex items-center gap-4 p-6 rounded-lg border bg-card">
  <h2 className="text-xl font-semibold">Client Name</h2>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

**Common utilities:**

- Layout: `flex`, `grid`, `block`, `inline`
- Spacing: `p-4` (padding), `m-4` (margin), `gap-2` (gap)
- Typography: `text-lg`, `font-bold`, `text-center`
- Colors: `bg-primary`, `text-foreground`, `border-border`
- Responsive: `md:flex-row`, `lg:grid-cols-3`

### Shadcn/ui Components

**Install components:**

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add dialog
```

**Usage:**

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

<Button variant="default" size="lg">
  Click Me
</Button>

<Input
  type="email"
  placeholder="Enter email"
/>
```

## 🧩 Component Development

### Creating a New Component

1. **Create the file** in appropriate directory:

```tsx
// src/components/clients/ClientCard.tsx
interface ClientCardProps {
  client: {
    id: string;
    name: string;
    email: string;
  };
  onEdit?: () => void;
}

export function ClientCard({ client, onEdit }: ClientCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{client.name}</h3>
      <p className="text-sm text-muted-foreground">{client.email}</p>
      {onEdit && (
        <Button onClick={onEdit} variant="outline" size="sm">
          Edit
        </Button>
      )}
    </div>
  );
}
```

2. **Component naming conventions:**

   - File: PascalCase - `ClientCard.tsx`
   - Export: Named export - `export function ClientCard`
   - Props interface: `[ComponentName]Props`

3. **Keep components small:**
   - Max 50 lines per component
   - If larger, split into smaller components
   - One component per file

### Component Patterns

**Composition:**

```tsx
// Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Client Details</CardTitle>
  </CardHeader>
  <CardContent>
    <ClientInfo client={client} />
  </CardContent>
</Card>

// Bad: Too many props
<ClientCard
  title="Client Details"
  showHeader={true}
  headerVariant="large"
  ... // Too many props
/>
```

**Conditional Rendering:**

```tsx
// Loading state
if (isLoading) {
  return <Skeleton />;
}

// Error state
if (error) {
  return <ErrorMessage error={error} />;
}

// Success state
return <ClientList clients={clients} />;
```

## 🎨 Styling Guide

### Layout

```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">
  <div>Left content</div>
  <div>Right content</div>
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Item key={item.id} {...item} />)}
</div>

// Container
<div className="container mx-auto px-6 py-8">
  <h1>Page content</h1>
</div>
```

### Responsive Design

```tsx
<div
  className="
  w-full           // Mobile: full width
  md:w-1/2         // Tablet: half width
  lg:w-1/3         // Desktop: third width
  flex-col         // Mobile: stack vertically
  md:flex-row      // Tablet+: horizontal
"
>
  Content
</div>
```

### Dark Mode

Use CSS variables for theming:

```tsx
<div className="bg-background text-foreground">
  <h1 className="text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
  <div className="border border-border">Box</div>
</div>
```

## 📊 State Management

### TanStack Query (Server State)

**Fetching data:**

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";

export function ClientsList() {
  const {
    data: clients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/client");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

**Mutations (create/update/delete):**

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function CreateClientForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newClient) => {
      const res = await fetch("/api/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Local State (useState)

```tsx
"use client";

import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}
```

## 📝 Forms & Validation

### React Hook Form + Zod

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define schema
const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export function ClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: ClientFormData) => {
    console.log(data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input {...register("name")} placeholder="Client name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input {...register("email")} type="email" placeholder="Email" />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## 🔧 Common Tasks

### Adding a New Page

1. Create page file:

```tsx
// src/app/clients/page.tsx
export default function ClientsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Clients</h1>
      <ClientsTable />
    </div>
  );
}
```

2. Add to navigation:

```tsx
// src/components/layout/sidebar/index.tsx
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Clients", href: "/clients", icon: UsersIcon }, // Add this
];
```

### Adding a Modal Dialog

```tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateClientDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Client</DialogTitle>
        </DialogHeader>
        <ClientForm />
      </DialogContent>
    </Dialog>
  );
}
```

### Data Table

```tsx
"use client";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

export function ClientsTable({ data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <table>{/* Render table */}</table>;
}
```

## ✅ Best Practices

### Performance

- Use Server Components when possible
- Lazy load heavy components
- Optimize images with `next/image`
- Minimize client-side JavaScript

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add proper `aria-labels`
- Ensure keyboard navigation works
- Test with screen readers

### Code Quality

- Type everything (no `any`)
- Extract repeated logic to hooks
- Keep components small and focused
- Write descriptive variable names

## 🐛 Troubleshooting

**"Cannot use hooks" error:**

- Add `'use client'` directive at top of file

**Hydration mismatch:**

- Ensure server and client render the same HTML
- Don't use `Math.random()` or `Date.now()` directly
- Use `useEffect` for client-only code

**Styling not applied:**

- Check Tailwind class names are correct
- Ensure no typos in class names
- Check if dark mode variables are used

---

**Ready to build amazing UIs! 🎨**
