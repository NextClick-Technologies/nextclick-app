-- ============================================================================
-- MANUAL MIGRATION SCRIPT
-- ============================================================================
-- This file contains all pending migrations that need to be applied manually
-- in the Supabase SQL Editor.
--
-- IMPORTANT: Run this entire script in the Supabase Dashboard > SQL Editor
-- 
-- Date: 2025-12-03
-- Purpose: Fix project manager access and RLS policies
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Create employee_project_access materialized view
-- ============================================================================
-- This view is critical for the isProjectManager() function to work
-- It maps which users have access to which projects and their role (manager/member)

-- Drop existing view if it exists
DROP MATERIALIZED VIEW IF EXISTS employee_project_access CASCADE;

CREATE MATERIALIZED VIEW employee_project_access AS
SELECT DISTINCT
  e.user_id,
  p.id as project_id,
  p.client_id,
  CASE 
    WHEN p.project_manager = e.id THEN 'manager'
    ELSE 'member'
  END as access_type
FROM employees e
INNER JOIN projects p ON (
  -- Employee is a project member (via employee_id in project_members)
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.employee_id = e.id
    AND pm.project_id = p.id
  )
  OR
  -- Employee is the project manager
  p.project_manager = e.id
);

-- Create unique index to allow concurrent refresh
CREATE UNIQUE INDEX idx_employee_project_access_unique 
  ON employee_project_access(user_id, project_id);

-- Create indexes for fast lookups
CREATE INDEX idx_employee_project_access_user_id 
  ON employee_project_access(user_id);
CREATE INDEX idx_employee_project_access_project_id 
  ON employee_project_access(project_id);
CREATE INDEX idx_employee_project_access_client_id 
  ON employee_project_access(client_id);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_employee_project_access()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY employee_project_access;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-refresh the view when data changes
DROP TRIGGER IF EXISTS refresh_employee_access_on_project_members ON project_members;
CREATE TRIGGER refresh_employee_access_on_project_members
AFTER INSERT OR UPDATE OR DELETE ON project_members
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_employee_project_access();

DROP TRIGGER IF EXISTS refresh_employee_access_on_projects ON projects;
CREATE TRIGGER refresh_employee_access_on_projects
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_employee_project_access();

DROP TRIGGER IF EXISTS refresh_employee_access_on_employees ON employees;
CREATE TRIGGER refresh_employee_access_on_employees
AFTER INSERT OR UPDATE OR DELETE ON employees
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_employee_project_access();

-- ============================================================================
-- MIGRATION 2: Update milestone RLS policies
-- ============================================================================
-- Only admin, manager, and project managers can create/update/delete milestones

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Enable all access for all users" ON milestones;
DROP POLICY IF EXISTS "ALL" ON milestones;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milestones;
DROP POLICY IF EXISTS "Enable insert for admin, manager, and project managers" ON milestones;
DROP POLICY IF EXISTS "Enable update for admin, manager, and project managers" ON milestones;
DROP POLICY IF EXISTS "Enable delete for admin, manager, and project managers" ON milestones;

-- Create policy for SELECT (read) - all authenticated users can read milestones
CREATE POLICY "milestones_select_all_authenticated"
ON milestones FOR SELECT
TO authenticated
USING (true);

-- Create policy for INSERT - admin, manager, or project manager
CREATE POLICY "milestones_insert_admin_manager_pm"
ON milestones FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Project manager for this milestone's project
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = milestones.project_id
        AND e.user_id = u.id
      )
    )
  )
);

-- Create policy for UPDATE - admin, manager, or project manager
CREATE POLICY "milestones_update_admin_manager_pm"
ON milestones FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Project manager for this milestone's project
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = project_id
        AND e.user_id = u.id
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Project manager for this milestone's project
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = milestones.project_id
        AND e.user_id = u.id
      )
    )
  )
);

-- Create policy for DELETE - admin, manager, or project manager
CREATE POLICY "milestones_delete_admin_manager_pm"
ON milestones FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Project manager for this milestone's project
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = project_id
        AND e.user_id = u.id
      )
    )
  )
);

-- ============================================================================
-- MIGRATION 3: Add projects DELETE policy
-- ============================================================================
-- Only admin and manager can delete projects

-- Drop existing policies first
DROP POLICY IF EXISTS "Enable delete for admin and manager" ON projects;
DROP POLICY IF EXISTS "projects_delete_admin_manager" ON projects;

CREATE POLICY "projects_delete_admin_manager"
ON projects FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- ============================================================================
-- MIGRATION 4: Fix payments RLS policies
-- ============================================================================
-- Remove dangerous ALL policy and add proper role-based policies

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
DROP POLICY IF EXISTS "ALL" ON payments;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON payments;
DROP POLICY IF EXISTS "Enable insert for admin and manager" ON payments;
DROP POLICY IF EXISTS "Enable update for admin and manager" ON payments;
DROP POLICY IF EXISTS "Enable delete for admin and manager" ON payments;

-- READ access - all authenticated users with permission
CREATE POLICY "payments_select_all_authenticated"
ON payments FOR SELECT
TO authenticated
USING (true);

-- CREATE access - admin and manager only
CREATE POLICY "payments_insert_admin_manager"
ON payments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- UPDATE access - admin and manager only
CREATE POLICY "payments_update_admin_manager"
ON payments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- DELETE access - admin and manager only
CREATE POLICY "payments_delete_admin_manager"
ON payments FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- ============================================================================
-- MIGRATION 5: Fix employees RLS policies
-- ============================================================================
-- Remove dangerous ALL policy and add proper role-based policies

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Allow all operations on employees" ON employees;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON employees;
DROP POLICY IF EXISTS "Enable insert for admin only" ON employees;
DROP POLICY IF EXISTS "Enable update for admin only" ON employees;
DROP POLICY IF EXISTS "Enable delete for admin only" ON employees;
DROP POLICY IF EXISTS "employees_select_admin" ON employees;
DROP POLICY IF EXISTS "employees_insert_admin" ON employees;
DROP POLICY IF EXISTS "employees_update_admin" ON employees;
DROP POLICY IF EXISTS "employees_delete_admin" ON employees;

-- READ access - admin and manager can read all, employees can read all for selection purposes
CREATE POLICY "employees_select_all_authenticated"
ON employees FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager', 'employee')
  )
);

-- CREATE access - admin only
CREATE POLICY "employees_insert_admin_only"
ON employees FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- UPDATE access - admin only
CREATE POLICY "employees_update_admin_only"
ON employees FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- DELETE access - admin only
CREATE POLICY "employees_delete_admin_only"
ON employees FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- MIGRATION 6: Fix project_members RLS policies to allow project managers
-- ============================================================================
-- Project managers should be able to add/remove team members from their projects
-- Currently only admin and manager can do this

-- Drop existing policies
DROP POLICY IF EXISTS "project_members_insert_admin_manager" ON project_members;
DROP POLICY IF EXISTS "project_members_delete_admin_manager" ON project_members;
DROP POLICY IF EXISTS "project_members_update_admin_manager" ON project_members;

-- INSERT policy: admin, manager, OR project manager of the project
CREATE POLICY "project_members_insert_admin_manager_or_pm"
ON project_members FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Employee who is the project manager
      -- Join: projects.project_manager = employees.id, employees.user_id = auth.uid()
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = project_members.project_id
        AND e.user_id = auth.uid()
      )
    )
  )
);

-- DELETE policy: admin, manager, OR project manager of the project
CREATE POLICY "project_members_delete_admin_manager_or_pm"
ON project_members FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Employee who is the project manager
      -- Join: projects.project_manager = employees.id, employees.user_id = auth.uid()
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = project_members.project_id
        AND e.user_id = auth.uid()
      )
    )
  )
);

-- UPDATE policy: admin, manager, OR project manager of the project
CREATE POLICY "project_members_update_admin_manager_or_pm"
ON project_members FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Employee who is the project manager
      -- Join: projects.project_manager = employees.id, employees.user_id = auth.uid()
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = project_members.project_id
        AND e.user_id = auth.uid()
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND (
      -- Admin or Manager role
      u.role IN ('admin', 'manager')
      OR
      -- Employee who is the project manager
      -- Join: projects.project_manager = employees.id, employees.user_id = auth.uid()
      EXISTS (
        SELECT 1 FROM projects p
        JOIN employees e ON p.project_manager = e.id
        WHERE p.id = project_members.project_id
        AND e.user_id = auth.uid()
      )
    )
  )
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after the migration to verify everything is working

-- Verify the materialized view was created and has data
SELECT COUNT(*) as total_access_records FROM employee_project_access;

-- Check project managers
SELECT 
  u.email,
  p.name as project_name,
  epa.access_type
FROM employee_project_access epa
JOIN users u ON epa.user_id = u.id
JOIN projects p ON epa.project_id = p.id
WHERE epa.access_type = 'manager'
ORDER BY u.email, p.name;

-- Verify project_members policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'project_members'
ORDER BY policyname;

-- ============================================================================
-- END OF MIGRATION SCRIPT
-- ============================================================================
