# API Reference

## Stack

- **Runtime**: Next.js App Router API routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth v5 (session-based)

## Base URL

```bash
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All endpoints require NextAuth session (except `/api/auth/*`).

### Login

```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## API Endpoints

### Clients

#### Get All Clients

```
GET /api/client?page=1&pageSize=10&orderBy=name:asc&gender=MALE
```

Query Parameters:

- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10, max: 100)
- `orderBy` (optional): Sorting (format: `column:asc` or `column:desc`, comma-separated)
- `gender` (optional): Filter by gender (MALE, FEMALE, OTHER)

#### Get Client by ID

```
GET /api/client/{id}
```

#### Create Client

```
POST /api/client
Content-Type: application/json

{
  "name": "John",
  "title": "MR",
  "familyName": "Doe",
  "gender": "MALE",
  "phoneNumber": "+1234567890",
  "email": "john@example.com"
}
```

#### Update Client

```
PATCH /api/client/{id}
Content-Type: application/json

{
  "name": "John Updated",
  "phoneNumber": "+1234567891"
}
```

#### Delete Client

```
DELETE /api/client/{id}
```

### Companies

#### Get All Companies

```
GET /api/company?page=1&pageSize=10&orderBy=createdAt:desc
```

#### Get Company by ID

```
GET /api/company/{id}
```

#### Create Company

```
POST /api/company
Content-Type: application/json

{
  "name": "ABC Corporation",
  "email": "info@abc.com",
  "address": "123 Main St",
  "phoneNumber": "+1234567890"
}
```

#### Update Company

```
PATCH /api/company/{id}
Content-Type: application/json

{
  "name": "ABC Corp Updated"
}
```

#### Delete Company

```
DELETE /api/company/{id}
```

### Projects

#### Get All Projects

```
GET /api/project?page=1&pageSize=10&orderBy=createdAt:desc
```

#### Get Project by ID

```
GET /api/project/{id}
```

#### Create Project

```
POST /api/project
Content-Type: application/json

{
  "name": "Website Redesign",
  "type": "web-development",
  "startDate": "2025-01-01T00:00:00Z",
  "finishDate": "2025-06-01T00:00:00Z",
  "budget": "50000",
  "paymentTerms": "NET_30D",
  "status": "ACTIVE",
  "priority": "HIGH",
  "description": "Complete website redesign project",
  "clientId": "uuid-here"
}
```

#### Update Project

```
PATCH /api/project/{id}
Content-Type: application/json

{
  "status": "COMPLETED",
  "completionDate": "2025-05-15T00:00:00Z"
}
```

#### Delete Project

```
DELETE /api/project/{id}
```

### Milestones

#### Get All Milestones

```
GET /api/milestone?page=1&pageSize=10&projectId=uuid-here
```

Query Parameters:

- `projectId` (optional): Filter by project ID

#### Get Milestone by ID

```
GET /api/milestone/{id}
```

#### Create Milestone

```
POST /api/milestone
Content-Type: application/json

{
  "name": "Phase 1 Complete",
  "description": "Initial development phase",
  "startDate": "2025-01-01T00:00:00Z",
  "finishDate": "2025-02-01T00:00:00Z",
  "status": "IN_PROGRESS",
  "projectId": "uuid-here"
}
```

#### Update Milestone

```
PATCH /api/milestone/{id}
```

#### Delete Milestone

```
DELETE /api/milestone/{id}
```

### Payments

#### Get All Payments

```
GET /api/payment?page=1&pageSize=10&amount=1000
```

#### Get Payment by ID

```
GET /api/payment/{id}
```

#### Create Payment

```
POST /api/payment
Content-Type: application/json

{
  "description": "First installment",
  "amount": "10000",
  "status": "COMPLETED",
  "date": "2025-01-15T00:00:00Z",
  "method": "BANK_TRANSFER",
  "projectId": "uuid-here"
}
```

#### Update Payment

```
PATCH /api/payment/{id}
```

#### Delete Payment

```
DELETE /api/payment/{id}
```

### Employees

#### Get All Employees

```
GET /api/employee?page=1&pageSize=10
```

#### Get Employee by ID

```
GET /api/employee/{id}
```

#### Create Employee

```
POST /api/employee
Content-Type: application/json

{
  "title": "MR",
  "name": "Jane",
  "familyName": "Smith",
  "gender": "FEMALE",
  "phoneNumber": "+1234567890",
  "email": "jane@company.com"
}
```

#### Update Employee

```
PATCH /api/employee/{id}
```

#### Delete Employee

```
DELETE /api/employee/{id}
```

### Communication Logs

#### Get All Communication Logs

```
GET /api/communication-log?page=1&pageSize=10&clientId=uuid-here
```

Query Parameters:

- `clientId` (optional): Filter by client ID

#### Get Communication Log by ID

```
GET /api/communication-log/{id}
```

#### Create Communication Log

```
POST /api/communication-log
Content-Type: application/json

{
  "date": "2025-01-15T10:00:00Z",
  "channel": "EMAIL",
  "summary": "Discussed project requirements",
  "followUpRequired": true,
  "followUpDate": "2025-01-20T10:00:00Z",
  "clientId": "uuid-here",
  "employeeId": "uuid-here"
}
```

#### Update Communication Log

```
PATCH /api/communication-log/{id}
```

#### Delete Communication Log

```
DELETE /api/communication-log/{id}
```

## Response Format

### Success Response

```json
{
  "data": {...},
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": {...}
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

Run the migration file in Supabase to create the database schema:

```sql
supabase/migrations/001_initial_schema.sql
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Resend (optional)
RESEND_API_KEY=your-resend-api-key
```

## Testing with Postman

Import the Postman collection from `docs/nextclick-app.postman_collection.json` and set the `baseUrl` variable to your API base URL.
