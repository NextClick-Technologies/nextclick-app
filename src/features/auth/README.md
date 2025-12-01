# Authentication Feature

## Overview
Handles user authentication, session management, and security for the application.

## Structure
- `api/` - Authentication API endpoints
- `components/` - Auth-related UI components (forms, buttons)
- `lib/` - Authentication utilities and session management
- `types/` - Auth-related TypeScript types
- `schemas/` - Validation schemas for auth forms
- `pages/` - Auth pages (signin, signup, reset password)

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
npm test features/(core)/auth
```
