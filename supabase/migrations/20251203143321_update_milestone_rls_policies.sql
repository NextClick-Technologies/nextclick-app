-- Update RLS policies for milestones table
-- Only admin, manager, and project managers can create/update/delete milestones

-- Drop existing permissive policy if it exists
DROP POLICY IF EXISTS "Enable all access for all users" ON milestones;

-- Create policy for SELECT (read) - all authenticated users can read milestones
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON milestones;
CREATE POLICY "Enable read access for authenticated users"
ON milestones FOR SELECT
TO authenticated
USING (true);

-- Create policy for INSERT - admin, manager, or project manager
DROP POLICY IF EXISTS "Enable insert for admin, manager, and project managers" ON milestones;
CREATE POLICY "Enable insert for admin, manager, and project managers"
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
DROP POLICY IF EXISTS "Enable update for admin, manager, and project managers" ON milestones;
CREATE POLICY "Enable update for admin, manager, and project managers"
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
        WHERE p.id = milestones.project_id
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
DROP POLICY IF EXISTS "Enable delete for admin, manager, and project managers" ON milestones;
CREATE POLICY "Enable delete for admin, manager, and project managers"
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
        WHERE p.id = milestones.project_id
        AND e.user_id = u.id
      )
    )
  )
);
