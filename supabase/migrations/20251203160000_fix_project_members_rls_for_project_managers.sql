-- ============================================================================
-- Fix project_members RLS policies to allow project managers
-- ============================================================================
-- Project managers should be able to add/remove team members from their projects
-- Currently only admin and manager can do this

-- Drop existing policies
DROP POLICY IF EXISTS "project_members_insert_admin_manager" ON project_members;
DROP POLICY IF EXISTS "project_members_delete_admin_manager" ON project_members;

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
DROP POLICY IF EXISTS "project_members_update_admin_manager" ON project_members;
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
