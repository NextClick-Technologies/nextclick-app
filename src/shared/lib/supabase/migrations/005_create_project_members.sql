-- Create project_members junction table for many-to-many relationship
-- between projects and employees

-- Project Members table
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  role VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure a member can only be added once per project
  UNIQUE(project_id, employee_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee_id ON project_members(employee_id);

-- Add comments for documentation
COMMENT ON TABLE project_members IS 'Junction table linking projects to team members (employees)';
COMMENT ON COLUMN project_members.role IS 'Optional role of the employee in this project (e.g., Developer, Designer, QA)';
