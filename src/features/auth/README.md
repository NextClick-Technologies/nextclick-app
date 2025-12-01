# Authentication Feature

## Overview

Handles user authentication, session management, and security for the application.

## Directory Structure

```
auth/
├── api/                    # API Layer
│   ├── [...nextauth]/      # NextAuth.js configuration
│   ├── create-user/        # User creation endpoint
│   ├── request-reset/      # Password reset request
│   ├── reset-password/     # Password reset handler
│   └── verify-email/       # Email verification
├── domain/                 # Domain/Business Logic Layer
│   ├── password.ts         # Password hashing & validation
│   ├── token.ts            # Secure token generation
│   └── schemas/            # Zod validation schemas
└── ui/                     # UI Layer (Frontend)
    ├── components/         # Auth UI components
    └── pages/              # Auth pages (signin, signup, etc.)
```

### Layer Responsibilities

**API Layer (`api/`)**: Authentication endpoints and NextAuth.js configuration.

**Domain Layer (`domain/`)**: Security utilities including:

- `password.ts` - Bcrypt password hashing and verification
- `token.ts` - Secure token generation for email verification and password reset
- `schemas/` - Input validation schemas using Zod

**UI Layer (`ui/`)**: Authentication forms and pages.

## Key Components

- `SignInForm` - Sign in form
- `SignUpForm` - User registration form
- `ResetPasswordForm` - Password reset form
- `VerifyEmailForm` - Email verification

## API Endpoints

- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/request-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address

## Key Functions

- `hashPassword` - Bcrypt password hashing
- `verifyPassword` - Password verification
- `generateSecureToken` - Token generation
- `validatePasswordStrength` - Password validation

## Dependencies

- **External:** `next-auth`, `bcryptjs`, `zod`
- **Internal:** `@/shared/lib/supabase`, `@/shared/components/ui`

## Security Features

- Bcrypt password hashing (12 rounds)
- Secure token generation
- Password strength validation
- Email verification
- Session management

## Testing

```bash
# Run unit tests
npm test features/auth

# Run E2E tests
npm run test:e2e -- --grep "auth"
```
