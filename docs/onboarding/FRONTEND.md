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

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected routes group
│   │   ├── clients/       # Client management pages
│   │   │   ├── page.tsx   # /clients
│   │   │   └── [id]/      
│   │   │       └── page.tsx # /clients/[id]
│   │   ├── projects/      # Project pages
│   │   ├── employees/     # Employee pages
│   │   └── layout.tsx     # Dashboard layout (sidebar)
│   ├── auth/              # Authentication pages (public)
│   │   ├── signin/
│   │   │   └── page.tsx   # /auth/signin
│   │   └── signup/
│   │       └── page.tsx   # /auth/signup
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (/)
├── components/            # React components
│   ├── ui/               # Base UI components (Shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/           # Layout components
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── footer/
│   ├── clients/          # Client-specific components
│   ├── projects/         # Project-specific components
│   ├── ErrorBoundary.tsx      # Error boundary
│   └── GlobalErrorHandler.tsx # Global error handler
├── hooks/                # Custom React hooks
│   ├── useClients.ts     # Client data hooks
│   ├── useProjects.ts    # Project data hooks
│   └── useAuth.ts        # Authentication hook
└── providers/            # React Context providers
    ├── QueryProvider.tsx  # TanStack Query provider
    └── ThemeProvider.tsx  # Theme provider
```

### Page vs Component

**Pages** (`page.tsx` in `app/`):
- Represent routes in the application
- Can fetch data on the server
- Export default function

**Components** (in `components/`):
- Reusable UI pieces
- Used within pages
- Export named function

## 🛠️ Tech Stack Deep Dive

### Next.js 16 App Router

**Server Components (default):**
```tsx
// This runs on the server
export default async function ClientsPage() {
  const clients = await getClients(); // Server-side data fetching
  
  return (
    <div>
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

**Client Components (interactive):**
```tsx
'use client'; // This directive makes it a Client Component

import { useState } from 'react';

export function ClientForm() {
  const [name, setName] = useState('');
  
  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
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
<div className="
  w-full           // Mobile: full width
  md:w-1/2         // Tablet: half width
  lg:w-1/3         // Desktop: third width
  flex-col         // Mobile: stack vertically
  md:flex-row      // Tablet+: horizontal
">
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
'use client';

import { useQuery } from '@tanstack/react-query';

export function ClientsList() {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await fetch('/api/client');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}
```

**Mutations (create/update/delete):**
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function CreateClientForm() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (newClient) => {
      const res = await fetch('/api/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });
      if (!res.ok) throw new Error('Failed to create');
      return res.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['clients'] });
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
'use client';

import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
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
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
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
        <Input {...register('name')} placeholder="Client name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input {...register('email')} type="email" placeholder="Email" />
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
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/clients', icon: UsersIcon }, // Add this
];
```

### Adding a Modal Dialog

```tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
'use client';

import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

export function ClientsTable({ data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      {/* Render table */}
    </table>
  );
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
