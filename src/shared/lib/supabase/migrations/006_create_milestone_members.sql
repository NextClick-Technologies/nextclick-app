-- Create milestone_members junction table for many-to-many relationship
-- between milestones and employees (team members)

-- Milestone Members table
CREATE TABLE IF NOT EXISTS milestone_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  role VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure a member can only be added once per milestone
  UNIQUE(milestone_id, employee_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milestone_members_milestone_id ON milestone_members(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_members_employee_id ON milestone_members(employee_id);

-- Add comments for documentation
COMMENT ON TABLE milestone_members IS 'Junction table linking milestones to team members (employees). Only project team members can be assigned to milestones.';
COMMENT ON COLUMN milestone_members.role IS 'Optional role of the employee in this milestone (e.g., Lead Developer, Tester, Reviewer)';
