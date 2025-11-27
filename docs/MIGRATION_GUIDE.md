# Database Migration Guide: camelCase to snake_case

This guide walks you through migrating your database columns from camelCase to snake_case while maintaining camelCase throughout your application code.

## Overview

- **Database Layer**: Uses snake_case for column names (e.g., `family_name`, `phone_number`, `created_at`)
- **Application Layer**: Uses camelCase throughout (e.g., `familyName`, `phoneNumber`, `createdAt`)
- **Transformation**: Automatic conversion using `humps` library at the API layer

## What Changed

### 1. Dependencies

- Added `humps` for case conversion
- Added `@types/humps` for TypeScript support

### 2. Database Schema

Multi-word columns renamed to snake_case:

- `familyName` → `family_name`
- `phoneNumber` → `phone_number`
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`
- `clientId` → `client_id`
- `projectId` → `project_id`
- `employeeId` → `employee_id`
- `startDate` → `start_date`
- `finishDate` → `finish_date`
- `paymentTerms` → `payment_terms`
- `completionDate` → `completion_date`
- `followUpRequired` → `follow_up_required`
- `followUpDate` → `follow_up_date`
- `preferredName` → `preferred_name`
- `userId` → `user_id`

Single-word columns remain unchanged: `id`, `name`, `title`, `gender`, `email`, `type`, `budget`, `status`, `priority`, `description`, `date`, `channel`, `summary`, `remarks`, `amount`, `method`, `photo`, `address`

### 3. Transformation Layer

New utilities in `src/lib/api/api-utils.ts`:

- `transformToDb(data)` - Converts camelCase to snake_case for database operations
- `transformFromDb(data)` - Converts snake_case to camelCase for application use
- `transformColumnName(column)` - Converts individual column names for filters/orderBy

### 4. Database Types

`src/types/database.type.ts` now uses snake_case for Row/Insert/Update interfaces to match actual database schema.

### 5. API Routes

All 14 API routes updated to:

- Transform request data before INSERT/UPDATE
- Transform response data after SELECT
- Transform column names in filters and orderBy parameters

## Migration Steps

### Step 1: Run the Database Migration

Execute the migration SQL in your Supabase SQL Editor:

```bash
# Copy the migration file content
cat src/lib/supabase/migrations/004_snake_case_columns.sql
```

Then paste and run it in Supabase Dashboard → SQL Editor.

**What it does:**

1. Drops triggers and indexes
2. Renames all camelCase columns to snake_case
3. Updates constraints
4. Recreates indexes and triggers with snake_case columns

### Step 2: Verify Migration

Check that columns were renamed correctly:

```sql
-- Check clients table
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'clients';

-- Should see: id, name, title, family_name, gender, phone_number, email, created_at, updated_at
```

### Step 3: Restart Your Development Server

```bash
# Stop the server if running (Ctrl+C)
# Start it again
npm run dev
```

### Step 4: Test CRUD Operations

Test each entity to ensure transformations work correctly:

#### Test Clients

```bash
# Create a client
curl -X POST http://localhost:3000/api/client \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "familyName": "Doe",
    "gender": "male",
    "phoneNumber": "+1234567890",
    "email": "john.doe@example.com"
  }'

# Get all clients
curl http://localhost:3000/api/client

# Verify response has camelCase: familyName, phoneNumber, createdAt, updatedAt
```

#### Test Projects

```bash
# Create a project
curl -X POST http://localhost:3000/api/project \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Project",
    "type": "Web Development",
    "startDate": "2024-01-01T00:00:00Z",
    "finishDate": "2024-12-31T00:00:00Z",
    "budget": "50000",
    "paymentTerms": "net_30d",
    "status": "active",
    "priority": "high",
    "description": "Test project",
    "clientId": "YOUR_CLIENT_ID"
  }'

# Verify response has camelCase: startDate, finishDate, paymentTerms, clientId, etc.
```

#### Test Ordering and Filtering

```bash
# Order by camelCase column name
curl "http://localhost:3000/api/client?orderBy=familyName:asc"

# Filter by camelCase parameter
curl "http://localhost:3000/api/milestone?projectId=YOUR_PROJECT_ID"
```

### Step 5: Test in UI

1. Go to `http://localhost:3000/clients`
2. Create a new client
3. Verify the data displays correctly
4. Test editing and deleting
5. Repeat for Companies, Projects, Employees, etc.

## Troubleshooting

### Issue: "column does not exist" error

**Problem**: Database still has camelCase columns  
**Solution**: Run the migration script again in Supabase

### Issue: Data returns with snake_case

**Problem**: Transformation not applied  
**Solution**:

- Check that API route imports `transformFromDb`
- Verify it's called on the response: `transformFromDb(data)`

### Issue: Insert/Update fails

**Problem**: Data not transformed to snake_case before database operation  
**Solution**:

- Check that API route imports `transformToDb`
- Verify it's used: `.insert([transformToDb(validatedData)])`

### Issue: OrderBy or filter not working

**Problem**: Column name not transformed  
**Solution**:

- Check that `transformColumnName` is imported
- Verify usage: `query.order(transformColumnName(column), { ascending })`
- For filters: `query.eq(transformColumnName("clientId"), clientId)`

## What Stays the Same

✅ All Zod schemas remain in camelCase  
✅ All React components use camelCase  
✅ All React Hook Form fields use camelCase  
✅ All frontend types use camelCase  
✅ All hooks use camelCase  
✅ No changes needed in components, forms, or UI code

## Verification Checklist

- [ ] Migration script executed successfully in Supabase
- [ ] Database columns are in snake_case (verify in Supabase Table Editor)
- [ ] API GET requests return camelCase data
- [ ] API POST requests accept camelCase data
- [ ] API PATCH requests accept camelCase data
- [ ] OrderBy parameters work with camelCase column names
- [ ] Filter parameters work with camelCase column names
- [ ] Frontend displays data correctly
- [ ] Forms submit and save data correctly
- [ ] No TypeScript errors in VSCode

## Rollback (If Needed)

If you need to rollback to camelCase in the database:

```sql
-- Example for clients table
ALTER TABLE clients RENAME COLUMN family_name TO "familyName";
ALTER TABLE clients RENAME COLUMN phone_number TO "phoneNumber";
ALTER TABLE clients RENAME COLUMN created_at TO "createdAt";
ALTER TABLE clients RENAME COLUMN updated_at TO "updatedAt";
-- ... repeat for other columns and tables
```

Then revert the code changes:

```bash
git revert HEAD
```

## Benefits of This Approach

1. **PostgreSQL Best Practices**: snake_case is the standard in PostgreSQL
2. **JavaScript Conventions**: camelCase remains in all application code
3. **Type Safety**: TypeScript catches mismatches between layers
4. **Automatic Transformation**: No manual conversion needed in business logic
5. **Selective Optimization**: Only multi-word columns are transformed (minimal overhead)

## Next Steps

After successful migration and testing:

1. Update API documentation if it references column names
2. Update any custom SQL queries to use snake_case
3. Inform team members about the change
4. Consider creating a database backup before deploying to production
