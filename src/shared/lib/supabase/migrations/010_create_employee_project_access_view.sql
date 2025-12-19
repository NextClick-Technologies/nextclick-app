-- Create a materialized view for employee project access for better performance
-- This combines both project_members and project_manager relationships

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
