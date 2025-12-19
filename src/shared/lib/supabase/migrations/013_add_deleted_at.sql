-- ============================================
-- MANUAL MIGRATION: Add Soft Delete Support
-- Execute this in Supabase SQL Editor
-- Date: 7 December 2025
-- ============================================

BEGIN;

-- Step 1: Add deleted_at columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE project_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE milestone_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Step 2: Create partial indexes
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at ON companies(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_milestones_deleted_at ON milestones(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_deleted_at ON employees(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_project_members_deleted_at ON project_members(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_milestone_members_deleted_at ON milestone_members(deleted_at) WHERE deleted_at IS NULL;

-- Step 3: Update materialized view
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
  EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.employee_id = e.id
    AND pm.project_id = p.id
    AND pm.deleted_at IS NULL
  )
  OR
  p.project_manager = e.id
)
WHERE e.deleted_at IS NULL
  AND p.deleted_at IS NULL;

CREATE UNIQUE INDEX idx_employee_project_access_unique 
  ON employee_project_access(user_id, project_id);

CREATE INDEX idx_employee_project_access_user_id 
  ON employee_project_access(user_id);
CREATE INDEX idx_employee_project_access_project_id 
  ON employee_project_access(project_id);
CREATE INDEX idx_employee_project_access_client_id 
  ON employee_project_access(client_id);

-- Step 4: Recreate triggers
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

-- Step 5: Add comments
COMMENT ON COLUMN users.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN companies.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN clients.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN projects.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN milestones.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN employees.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN project_members.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN milestone_members.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';

COMMIT;

-- Verify migration
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE column_name = 'deleted_at'
  AND table_schema = 'public'
ORDER BY table_name;
