-- Migration: 001_link_users_to_supabase_auth
-- This migration prepares the public.users table to work with Supabase Auth
-- Run this BEFORE deleting test data and BEFORE creating any Supabase Auth users

-- 1. Drop existing foreign key constraints that reference public.users
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;

-- 2. Remove password-related columns (Supabase Auth handles these)
ALTER TABLE public.users 
  DROP COLUMN IF EXISTS password_hash,
  DROP COLUMN IF EXISTS email_verification_token,
  DROP COLUMN IF EXISTS email_verification_expires,
  DROP COLUMN IF EXISTS password_reset_token,
  DROP COLUMN IF EXISTS password_reset_expires,
  DROP COLUMN IF EXISTS email_verified;

-- 3. Clear existing test data from public.users (they don't have matching auth.users entries)
-- This must happen BEFORE adding the foreign key constraint
DELETE FROM public.users;

-- 4. Add foreign key to auth.users (the id in public.users must match auth.users.id)
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. Recreate foreign keys pointing to public.users
ALTER TABLE employees 
  ADD CONSTRAINT employees_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE audit_logs 
  ADD CONSTRAINT audit_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

-- Add comment for clarity
COMMENT ON TABLE public.users IS 'User profile and role data. ID must match auth.users.id (managed by Supabase Auth)';
