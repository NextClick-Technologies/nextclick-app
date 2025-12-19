# Authentication Feature

This application uses **Supabase Auth** for authentication, integrated with Row Level Security (RLS) for database access control.

## Architecture

### Three-Layer Security Model

1. **Database RLS (First Line of Defense)**

   - RLS policies automatically restrict data access based on user role
   - Uses `auth.uid()` from Supabase Auth session
   - Enforced at the database level - cannot be bypassed by application code

2. **Backend Logic (Business Rules)**

   - API middleware validates authentication and permissions
   - Application-level permission checks for complex business rules
   - Audit logging for security events

3. **Frontend (User Experience)**
   - Permission-based UI rendering
   - Role-based navigation and component visibility
   - Real-time auth state management

## Directory Structure

```
src/features/auth/
├── api/
│   └── create-user.handler.ts    # Admin-only user creation
├── domain/
│   └── permissions.ts            # Role-permission mapping
└── ui/
    └── pages/
        ├── signin/               # Sign in page
        ├── signout/              # Sign out confirmation
        ├── request-reset/        # Password reset request
        └── reset-password/       # Password reset form
```

## Authentication Flow

### Sign In

1. User enters email/password on `/auth/signin`
2. Client calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials and creates session
4. Session stored in cookies (handled by `@supabase/ssr`)
5. Middleware refreshes session on each request

### Sign Out

1. User clicks sign out
2. Client calls `supabase.auth.signOut()`
3. Session cookies cleared
4. User redirected to sign in page

### Password Reset

1. User requests reset on `/auth/request-reset`
2. Client calls `supabase.auth.resetPasswordForEmail()`
3. Supabase sends reset email with magic link
4. User clicks link, redirected to `/auth/reset-password`
5. Client calls `supabase.auth.updateUser({ password })`

### Admin User Creation

1. Admin submits new user form
2. API handler validates admin role
3. `supabaseAdmin.auth.admin.createUser()` creates auth user
4. Database trigger creates `public.users` record with role
5. Welcome email sent to new user

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For password reset email redirects
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Key Files

### Supabase Clients

- `src/shared/lib/supabase/server.ts` - Server-side client (respects RLS)
- `src/shared/lib/supabase/client.ts` - Browser client (respects RLS)

### Auth Helpers

- `src/shared/lib/auth/supabase-auth.ts` - Server-side auth utilities
- `src/shared/lib/auth/permissions.ts` - Role-permission mapping

### Middleware

- `src/middleware.ts` - Route protection and session refresh
- `src/shared/lib/api/auth-middleware.ts` - API route protection

### Context

- `src/shared/contexts/AuthContext.tsx` - Client-side auth state

## User Roles

| Role       | Description                             |
| ---------- | --------------------------------------- |
| `admin`    | Full system access                      |
| `manager`  | Can manage clients, projects, companies |
| `employee` | Can view assigned projects              |
| `viewer`   | Read-only access                        |

## Database Schema

### `public.users` Table

- `id` - UUID (references `auth.users.id`)
- `email` - User email
- `role` - User role (admin/manager/employee/viewer)
- `is_active` - Account status
- `last_login` - Last login timestamp
- `created_at`, `updated_at`, `deleted_at` - Timestamps

### Triggers

- `on_auth_user_created` - Creates `public.users` record when auth user created
- `on_auth_user_deleted` - Soft-deletes `public.users` when auth user deleted
- `on_auth_user_email_updated` - Syncs email changes

## Usage Examples

### Check Authentication (Server)

```typescript
import { getUser, getUserWithRole } from "@/shared/lib/auth/supabase-auth";

// Get authenticated user
const user = await getUser();

// Get user with role
const userWithRole = await getUserWithRole();
if (userWithRole?.role === "admin") {
  // Admin-specific logic
}
```

### Check Permissions (Client)

```typescript
import { useAuth } from "@/shared/contexts/AuthContext";

function MyComponent() {
  const { can, isAdmin, user } = useAuth();

  if (!can("clients:create")) {
    return <AccessDenied />;
  }

  return <CreateClientForm />;
}
```

### Protect API Route

```typescript
import { requirePermission } from "@/shared/lib/api/auth-middleware";

export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, "clients:create");
  if (authResult instanceof NextResponse) {
    return authResult; // Returns 401/403 error
  }

  // User is authenticated and has permission
  const { userId, userRole } = authResult;
  // ... handle request
}
```
