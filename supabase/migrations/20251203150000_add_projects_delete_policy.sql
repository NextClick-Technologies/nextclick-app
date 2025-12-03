-- Migration: Add DELETE RLS policy for projects table
-- Created: 2025-12-03
-- Purpose: Restrict project deletion to admin and manager roles only

-- Add DELETE policy for projects
CREATE POLICY "projects_delete_admin_manager"
ON "public"."projects"
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
