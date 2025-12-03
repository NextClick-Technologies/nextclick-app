-- Migration: Fix Employees Table RLS Policies
-- Created: 2025-12-03
-- Purpose: Remove dangerous "ALL" policy and add proper DELETE policy

-- Remove the dangerous "ALL" policy that allows everyone to do everything
DROP POLICY IF EXISTS "ALL" ON "public"."employees";

-- The following policies already exist and are correct:
-- - employees_insert_admin (INSERT - admin only)
-- - employees_select_admin (SELECT - admin only)
-- - employees_update_admin (UPDATE - admin only)

-- Add DELETE policy - only admin can delete employees
CREATE POLICY "employees_delete_admin"
ON "public"."employees"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
