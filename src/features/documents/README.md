# Documents Feature

## Overview

Manages document storage, organization, and sharing across projects and clients.

## Directory Structure

```
documents/
├── api/                    # API Layer
│   └── handlers.ts         # Document CRUD handlers
├── domain/                 # Domain/Business Logic Layer
│   ├── repository.ts       # Database queries
│   ├── service.ts          # Document management logic
│   ├── storage.service.ts  # File storage integration
│   ├── schemas/            # Zod validation schemas
│   └── types/              # TypeScript type definitions
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Document UI components
    ├── hooks/              # React Query hooks
    └── pages/              # Document pages
```

### Layer Responsibilities

**API Layer (`api/`)**: Thin HTTP handlers for document operations.

**Domain Layer (`domain/`)**: Core document management logic including:

- `repository.ts` - Document metadata database operations
- `service.ts` - Document business logic
- `storage.service.ts` - File storage integration (S3, Supabase Storage, etc.)
- `schemas/` - Input validation schemas using Zod
- `types/` - TypeScript interfaces for documents

**UI Layer (`ui/`)**: Document upload, viewer, and management interfaces.

## Key Components

- `DocumentUploader` - File upload component
- `DocumentViewer` - Preview documents
- `DocumentList` - List and search documents
- `FolderTree` - Hierarchical folder structure

## API Endpoints

- `GET /api/documents` - List documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/[id]` - Get document by ID
- `PUT /api/documents/[id]` - Update document metadata
- `DELETE /api/documents/[id]` - Delete document
- `GET /api/documents/[id]/download` - Download document

## Dependencies

- **External:** `@tanstack/react-query`, `zod`, `@supabase/storage-js`
- **Internal:** `@/shared/components/ui`, `@/shared/lib/supabase`

## Related Features

- Projects - Project documents
- Clients - Client documents

## Testing

```bash
# Run unit tests
npm test features/documents

# Run integration tests
npm test -- --grep "documents"
```
