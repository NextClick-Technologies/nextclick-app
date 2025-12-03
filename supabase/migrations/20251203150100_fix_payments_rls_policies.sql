-- Migration: Fix Payments Table RLS Policies
-- Created: 2025-12-03
-- Purpose: Replace dangerous "ALL" policy with proper role-based access control

-- Remove the dangerous "ALL" policy that allows everyone to do everything
DROP POLICY IF EXISTS "ALL" ON "public"."payments";

-- Add proper SELECT policy - admin, manager, and employee can view payments
-- Viewers cannot see payments
CREATE POLICY "payments_select_all_except_viewer"
ON "public"."payments"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'employee')
  )
);

-- Add INSERT policy - only admin and manager can create payments
CREATE POLICY "payments_insert_admin_manager"
ON "public"."payments"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);

-- Add UPDATE policy - only admin and manager can update payments
CREATE POLICY "payments_update_admin_manager"
ON "public"."payments"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);

-- Add DELETE policy - only admin and manager can delete payments
CREATE POLICY "payments_delete_admin_manager"
ON "public"."payments"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);
