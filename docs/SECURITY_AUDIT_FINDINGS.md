# Security Audit Findings - December 3, 2025

## Executive Summary

**CRITICAL SECURITY VULNERABILITIES FOUND**

During implementation of UI permission controls, a comprehensive security audit revealed **multiple critical vulnerabilities** that allow users to bypass UI restrictions through direct API calls.

---

## Critical Vulnerabilities

### 🔴 CRITICAL #1: Payment API - No Authentication Required

**Severity**: CRITICAL  
**Risk**: Any unauthenticated user can read, create, update, or delete payments

**Location**: `/src/features/payment/api/handlers.ts`

**Issues**:

- ❌ `getPayments()` - No auth middleware
- ❌ `createPayment()` - No auth middleware
- ❌ `getPayment()` - No auth middleware
- ❌ `updatePayment()` - No auth middleware
- ❌ `deletePayment()` - No auth middleware

**Database Policy**:

```sql
-- PAYMENTS TABLE HAS DANGEROUS POLICY:
policyname: "ALL"
cmd: "ALL"
qual: "true"  -- ⚠️ ALLOWS EVERYONE TO DO EVERYTHING
```

**Impact**: Anyone can:

- Read all payment records (data breach)
- Create fraudulent payment records
- Modify payment amounts and details
- Delete payment history

---

### 🔴 CRITICAL #2: Employee API - No Authentication Required

**Severity**: CRITICAL (NOW FIXED)  
**Risk**: Any user can manage employee records

**Location**: `/src/features/employees/api/handlers.ts`

**Issues**:

- ❌ `getEmployees()` - No auth middleware
- ❌ `createEmployee()` - No auth middleware
- ❌ `getEmployeeById()` - No auth middleware
- ❌ `updateEmployee()` - No auth middleware
- ❌ `deleteEmployee()` - No auth middleware

**Status**: ✅ **FIXED** - Added authentication with proper role separation:

- **READ** (getEmployees, getEmployeeById): `requireAdminOrManager` - Managers need to read employees for selecting project managers and team members
- **CREATE/UPDATE/DELETE**: `requireAdmin` - Only admins can modify employee records

**Database Policies**:

```sql
-- EMPLOYEES TABLE HAS CONFLICTING POLICIES:
1. policyname: "ALL", cmd: "ALL", qual: "true"  -- ⚠️ OPEN ACCESS
2. policyname: "employees_insert_admin" -- Admin only (correct but overridden)
3. policyname: "employees_select_admin" -- Admin only (correct but overridden)
4. policyname: "employees_update_admin" -- Admin only (correct but overridden)
```

**Impact**: The "ALL" policy overrides the admin-only policies, allowing anyone to:

- Read all employee records (PII breach)
- Create new employee records
- Modify employee data
- Delete employee records

---

### 🟠 HIGH #3: Project Deletion - Missing Authentication

**Severity**: HIGH (NOW FIXED)  
**Risk**: Anyone could delete projects

**Location**: `/src/features/projects/api/projects.handlers.ts`

**Issue**: `deleteProject()` handler had no auth middleware

**Status**: ✅ **FIXED** - Added `requireAdminOrManager` middleware

---

### 🟠 HIGH #4: Company Deletion - Missing Authentication

**Severity**: HIGH (NOW FIXED)
**Risk**: Anyone could delete companies

**Location**: `/src/features/companies/api/handlers.ts`

**Issue**: `deleteCompany()` handler had no auth middleware

**Status**: ✅ **FIXED** - Added `requireAdminOrManager` middleware

---

### 🟠 HIGH #5: Projects Table - No DELETE Policy

**Severity**: HIGH (NOW FIXED)
**Risk**: RLS not enforcing delete restrictions

**Database Issue**: Projects table had no DELETE RLS policy

**Status**: ✅ **FIXED** - Created migration to add DELETE policy for admin/manager only

---

## Security Architecture Overview

### Current Defense Layers

The application **should** have 5 layers of security:

1. **Database RLS Policies** - PostgreSQL Row Level Security
2. **API Authentication Middleware** - NextAuth session validation
3. **API Authorization Middleware** - Role-based permission checks
4. **Service Layer Filtering** - Data filtering by user context
5. **UI Permission Controls** - Hide buttons based on roles

### Vulnerabilities by Layer

**Layer 1 (Database RLS)**:

- ❌ Payments: Wide-open `ALL` policy
- ❌ Employees: Conflicting policies (ALL overrides admin-only)
- ✅ Projects: Properly configured (INSERT/UPDATE admin/manager, SELECT role-based)
- ✅ Companies: Properly configured (all ops admin/manager only)
- ✅ Clients: Properly configured (INSERT/UPDATE/DELETE admin/manager, SELECT role-based)
- ✅ Milestones: Properly configured (admin/manager/project-managers only)

**Layer 2 (API Authentication)**:

- ❌ Payment handlers: No `requireAuth()` calls
- ❌ Employee handlers: No `requireAuth()` calls
- ✅ Project handlers: All have auth middleware
- ✅ Company handlers: All have auth middleware
- ✅ Client handlers: All have auth middleware
- ✅ Milestone handlers: All have auth middleware

**Layer 3 (API Authorization)**:

- ❌ Payment handlers: No role checks
- ❌ Employee handlers: No role checks
- ✅ Projects: CREATE/UPDATE/DELETE require admin/manager
- ✅ Companies: CREATE/UPDATE/DELETE require admin/manager
- ✅ Clients: CREATE/UPDATE/DELETE require admin/manager
- ✅ Milestones: CREATE/UPDATE/DELETE check admin/manager/project-manager

**Layer 4 (Service Filtering)**:

- ✅ Projects service: Filters by user role and project access
- ✅ Companies service: Filters by user role
- ✅ Clients service: Filters by user role and project access
- ❌ Payment service: No filtering implemented
- ❌ Employee service: No filtering implemented

**Layer 5 (UI Controls)**:

- ✅ Projects: Add button hidden for employees/viewers
- ✅ Companies: Add button hidden for employees/viewers
- ⚠️ Clients: Add button still visible to all (pending fix)
- ⚠️ Detail pages: Edit/Delete buttons not hidden yet

---

## Using Service Role Key (Bypasses RLS)

**IMPORTANT**: The application uses Supabase **Service Role Key** in all API handlers via `supabaseAdmin` client.

```typescript
// src/shared/lib/supabase/server.ts
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

**What this means**:

- ✅ Service role key **bypasses all RLS policies**
- ✅ This is **intentional** for server-side operations
- ⚠️ **API middleware becomes critical** - RLS is backup, not primary defense
- ⚠️ Every API handler **MUST** have authentication and authorization checks
- ⚠️ Database RLS policies still provide **defense-in-depth** if service role is compromised

**Current Protection**:

- Projects ✅: Has API middleware (RLS bypassed but still protected)
- Companies ✅: Has API middleware (RLS bypassed but still protected)
- Clients ✅: Has API middleware (RLS bypassed but still protected)
- Milestones ✅: Has API middleware (RLS bypassed but still protected)
- **Payments ❌: NO API middleware, NO protection** (CRITICAL)
- **Employees ❌: NO API middleware, NO protection** (CRITICAL)

---

## Remediation Required

### IMMEDIATE (Critical Priority)

#### 1. Payment Handlers - Add Authentication

```typescript
// All payment handlers need auth middleware:
export async function getPayments(request: NextRequest) {
  const authResult = await requirePermission(request, "payments:read");
  if (authResult instanceof NextResponse) return authResult;
  // ... rest of implementation
}

export async function createPayment(request: NextRequest) {
  const authResult = await requireAdminOrManager(request);
  if (authResult instanceof NextResponse) return authResult;
  // ... rest of implementation
}

// Similar for updatePayment, deletePayment, getPayment
```

#### 2. Employee Handlers - Add Authentication

```typescript
// Employees should be admin-only:
export async function getEmployees(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  // ... rest of implementation
}

export async function createEmployee(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;
  // ... rest of implementation
}

// Similar for updateEmployee, deleteEmployee, getEmployeeById
```

#### 3. Fix Database RLS Policies

**Payments Table**:

```sql
-- Remove dangerous ALL policy
DROP POLICY IF EXISTS "ALL" ON payments;

-- Add proper policies
CREATE POLICY "payments_select_all_except_viewer"
ON payments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'employee')
  )
);

CREATE POLICY "payments_insert_admin_manager"
ON payments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);

CREATE POLICY "payments_update_admin_manager"
ON payments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);

CREATE POLICY "payments_delete_admin_manager"
ON payments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);
```

**Employees Table**:

```sql
-- Remove dangerous ALL policy
DROP POLICY IF EXISTS "ALL" ON employees;

-- Keep existing admin-only policies (they're correct):
-- employees_insert_admin
-- employees_select_admin
-- employees_update_admin

-- Add DELETE policy
CREATE POLICY "employees_delete_admin"
ON employees FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
```

### HIGH Priority

#### 4. Add Request Parameter to Route Handlers

Files that need updates:

- `/src/app/api/payment/[id]/route.ts` - Pass request to handlers
- `/src/app/api/employee/[id]/route.ts` - Pass request to handlers

#### 5. UI Permission Controls

- ClientsPage: Hide Add button for employees/viewers
- Detail pages: Hide Edit/Delete buttons based on role
- Project detail: Hide milestone buttons for non-project-managers

---

## Verification Checklist

After fixes, verify:

- [ ] Payment API returns 401 when not authenticated
- [ ] Payment API returns 403 when employee/viewer tries to create
- [ ] Employee API returns 401 when not authenticated
- [ ] Employee API returns 403 when non-admin tries to access
- [ ] Projects table DELETE requires admin/manager (RLS + API)
- [ ] All handlers in all features have auth middleware
- [ ] All RLS policies follow least-privilege principle
- [ ] No "ALL" or "true" policies remain on sensitive tables

---

## Testing Strategy

### Manual Testing

1. Test as unauthenticated user (should get 401)
2. Test as viewer (should get 403 for create/update/delete)
3. Test as employee (should get 403 for payments/employees)
4. Test as manager (should succeed for most operations)
5. Test as admin (should succeed for all operations)

### Automated Testing

Create integration tests for:

- [ ] Payment API auth checks
- [ ] Employee API auth checks
- [ ] Project deletion auth
- [ ] Company deletion auth
- [ ] RLS policies with actual auth context

---

## Files Modified (Security Fixes)

### ✅ Already Fixed

1. `src/features/projects/api/projects.handlers.ts` - Added auth to deleteProject
2. `src/features/companies/api/handlers.ts` - Added auth to deleteCompany
3. `src/app/api/project/[id]/route.ts` - Pass request to deleteProject
4. `src/app/api/company/[id]/route.ts` - Pass request to deleteCompany
5. `supabase/migrations/20251203150000_add_projects_delete_policy.sql` - New RLS policy

### ❌ Requires Immediate Fix

1. `src/features/payment/api/handlers.ts` - Add auth middleware to all handlers
2. `src/features/employees/api/handlers.ts` - Add auth middleware to all handlers
3. `src/app/api/payment/[id]/route.ts` - Pass request to handlers
4. `src/app/api/employee/[id]/route.ts` - Pass request to handlers
5. Create migration to fix payments RLS policies
6. Create migration to fix employees RLS policies

---

## Lessons Learned

1. **Defense-in-depth works**: Multiple layers caught these issues before production
2. **RLS is backup, not primary**: Service role bypasses RLS, so API middleware is critical
3. **Systematic review needed**: Check all handlers, not just the ones being actively developed
4. **Database policies must be reviewed**: "ALL" policies are almost never correct
5. **Testing is essential**: Manual testing with different roles would have caught these

---

## Sign-off

**Audit Date**: December 3, 2025  
**Audited By**: GitHub Copilot (AI Assistant)  
**Status**: CRITICAL VULNERABILITIES FOUND - IMMEDIATE ACTION REQUIRED  
**Next Review**: After all remediation items completed
