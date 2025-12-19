-- ============================================
-- Migration: Add soft delete support
-- Adds deleted_at column to master data and junction tables
-- Date: 7 December 2025
-- ============================================

-- Master data tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Junction tables
ALTER TABLE project_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;
ALTER TABLE milestone_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Create partial indexes for better query performance (only indexes non-deleted records)
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at ON companies(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_milestones_deleted_at ON milestones(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_employees_deleted_at ON employees(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_project_members_deleted_at ON project_members(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_milestone_members_deleted_at ON milestone_members(deleted_at) WHERE deleted_at IS NULL;

-- Update employee_project_access materialized view to exclude soft-deleted records
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
    AND pm.deleted_at IS NULL  -- Exclude soft-deleted memberships
  )
  OR
  -- Employee is the project manager
  p.project_manager = e.id
)
WHERE e.deleted_at IS NULL    -- Exclude soft-deleted employees
  AND p.deleted_at IS NULL;   -- Exclude soft-deleted projects

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

-- Recreate triggers for materialized view refresh
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

-- Add comments
COMMENT ON COLUMN users.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN companies.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN clients.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN projects.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN milestones.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN employees.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN project_members.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
COMMENT ON COLUMN milestone_members.deleted_at IS 'Timestamp when record was soft-deleted. NULL = active record';
