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

### Directory Structure

```
src/
├── app/api/               # API Routes (serverless functions)
│   ├── auth/             # Authentication endpoints
│   │   ├── [...nextauth]/  # NextAuth handler
│   │   ├── create-user/
│   │   │   └── route.ts    # POST /api/auth/create-user
│   │   ├── verify-email/
│   │   │   └── route.ts    # POST /api/auth/verify-email
│   │   └── reset-password/
│   │       └── route.ts    # POST /api/auth/reset-password
│   ├── client/           # Client CRUD
│   │   ├── route.ts      # GET, POST /api/client
│   │   └── [id]/
│   │       └── route.ts  # GET, PUT, DELETE /api/client/[id]
│   ├── project/          # Project CRUD
│   ├── employee/         # Employee CRUD
│   └── webhooks/         # Webhook handlers
│       └── vercel-deploy/
├── lib/                   # Backend utilities
│   ├── auth/             # Authentication logic
│   │   ├── index.ts      # NextAuth config
│   │   └── password.ts   # Password hashing
│   ├── supabase/         # Database client & queries
│   │   ├── server.ts     # Server-side client
│   │   ├── client.ts     # Client-side client
│   │   └── migrations/   # SQL migrations
│   ├── email/            # Email sending
│   ├── logger.ts         # Pino structured logging
│   └── error-monitoring/ # Error tracking
│       ├── handler.ts    # Error classification
│       ├── discord.ts    # Discord notifications
│       ├── jira.ts       # Jira integration
│       └── supabase.ts   # Error logging
└── types/                # TypeScript types
    ├── client.types.ts
    ├── project.types.ts
    └── ...
```

### API Route Anatomy

```typescript
// src/app/api/client/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorMonitoring } from '@/lib/error-monitoring/api-wrapper';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// GET /api/client
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  // 1. Authentication check
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
export const GET = async (req: NextRequest) => { /* ... */ }
export const POST = async (req: NextRequest) => { /* ... */ }
export const PUT = async (req: NextRequest) => { /* ... */ }
export const PATCH = async (req: NextRequest) => { /* ... */ }
export const DELETE = async (req: NextRequest) => { /* ... */ }
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
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
```

**Basic queries:**
```typescript
// SELECT
const { data, error } = await supabase
  .from('clients')
  .select('*');

// SELECT with filter
const { data } = await supabase
  .from('clients')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });

// INSERT
const { data, error } = await supabase
  .from('clients')
  .insert({ name: 'John', email: 'john@example.com' })
  .select()
  .single();

// UPDATE
const { data, error } = await supabase
  .from('clients')
  .update({ name: 'Jane' })
  .eq('id', clientId)
  .select()
  .single();

// DELETE
const { error } = await supabase
  .from('clients')
  .delete()
  .eq('id', clientId);
```

### Input Validation (Zod)

```typescript
import { z } from 'zod';

// Define schema
const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

// Validate input
const body = await req.json();
const validated = createClientSchema.parse(body); // Throws if invalid

// Or with safeParse (no throw)
const result = createClientSchema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { error: result.error.format() },
    { status: 400 }
  );
}
```

### Structured Logging (Pino)

```typescript
import { logger } from '@/lib/logger';

// Log levels
logger.info({ userId: session.user.id }, 'User logged in');
logger.warn({ clientId }, 'Client not found');
logger.error({ error: err.message }, 'Failed to create client');
logger.debug({ data }, 'Debug info');

// Logs are JSON format for easy parsing
// {"level":"info","time":1234567890,"userId":"123","msg":"User logged in"}
```

## 🔌 API Development

### Creating a New API Endpoint

1. **Create route file:**

```typescript
// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorMonitoring } from '@/lib/error-monitoring/api-wrapper';
import { auth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  status: z.enum(['todo', 'in_progress', 'done']),
  assignee_id: z.string().uuid().optional(),
});

// GET /api/tasks
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error({ error }, 'Failed to fetch tasks');
    throw error;
  }

  return NextResponse.json({ data: tasks });
});

// POST /api/tasks
export const POST = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate input
  const body = await req.json();
  const validated = taskSchema.parse(body);

  // Create task
  const supabase = await createClient();
  const { data: task, error } = await supabase
    .from('tasks')
    .insert({
      ...validated,
      created_by: session.user.id,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error }, 'Failed to create task');
    throw error;
  }

  logger.info({ taskId: task.id }, 'Task created successfully');

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
  status: 'todo' | 'in_progress' | 'done';
  assignee_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'created_by' | 'created_at' | 'updated_at'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
```

### Error Responses

```typescript
// 400 Bad Request - Invalid input
return NextResponse.json(
  { error: 'Invalid email format' },
  { status: 400 }
);

// 401 Unauthorized - No authentication
return NextResponse.json(
  { error: 'Unauthorized' },
  { status: 401 }
);

// 403 Forbidden - No permission
return NextResponse.json(
  { error: 'You do not have permission to access this resource' },
  { status: 403 }
);

// 404 Not Found
return NextResponse.json(
  { error: 'Client not found' },
  { status: 404 }
);

// 500 Internal Server Error
return NextResponse.json(
  { error: 'Internal server error' },
  { status: 500 }
);
```

## 💾 Database Operations

### Query Functions Pattern

Create reusable query functions in `lib/supabase/`:

```typescript
// src/lib/supabase/client-queries.ts
import { createClient } from './server';
import type { Client, CreateClientInput, UpdateClientInput } from '@/types/client.types';

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
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
    .from('clients')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
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
import { auth } from '@/lib/auth';

export const GET = withErrorMonitoring(async (req: NextRequest) => {
  // Get session
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has admin role
  if (session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden: Admin access required' },
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
import { withErrorMonitoring } from '@/lib/error-monitoring/api-wrapper';

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
import { logger } from '@/lib/logger';

// Good logging practices
logger.info(
  { userId: session.user.id, action: 'create_client' },
  'Client created successfully'
);

logger.warn(
  { clientId, requestedBy: session.user.id },
  'Attempted to access non-existent client'
);

logger.error(
  { 
    error: error.message,
    stack: error.stack,
    context: { userId, action: 'update_client' }
  },
  'Failed to update client'
);

// Never use console.log in production!
// ❌ console.log('Client created');  // Don't do this
// ✅ logger.info({ clientId }, 'Client created');  // Do this
```

## 🔧 Common Tasks

### Add CRUD Endpoints

```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withErrorMonitoring } from '@/lib/error-monitoring/api-wrapper';
import { auth } from '@/lib/auth';
import * as queries from '@/lib/supabase/resource-queries';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  // ... other fields
});

// List all
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const items = await queries.getAll();
  return NextResponse.json({ data: items });
});

// Create new
export const POST = withErrorMonitoring(async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validated = schema.parse(body);
  
  const item = await queries.create(validated);
  return NextResponse.json({ data: item }, { status: 201 });
});

// src/app/api/resource/[id]/route.ts

// Get by ID
export const GET = withErrorMonitoring(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const item = await queries.getById(params.id);
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: item });
});

// Update
export const PUT = withErrorMonitoring(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const validated = schema.partial().parse(body);
  
  const item = await queries.update(params.id, validated);
  return NextResponse.json({ data: item });
});

// Delete
export const DELETE = withErrorMonitoring(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await queries.remove(params.id);
  return NextResponse.json({ success: true });
});
```

### Send Email

```typescript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: user.email,
  subject: 'Welcome to Next Click',
  template: 'welcome',
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
