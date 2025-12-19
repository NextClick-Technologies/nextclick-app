-- Migration 008: Add Cascading Soft Delete Triggers
-- This migration adds database triggers to automatically soft-delete dependent records
-- when a parent record is soft-deleted

-- Function to cascade soft delete from clients to projects
CREATE OR REPLACE FUNCTION cascade_soft_delete_client()
RETURNS TRIGGER AS $$
BEGIN
  -- Soft delete all projects belonging to this client
  UPDATE projects
  SET deleted_at = NEW.deleted_at
  WHERE client_id = NEW.id
    AND deleted_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for clients table
DROP TRIGGER IF EXISTS trigger_cascade_soft_delete_client ON clients;
CREATE TRIGGER trigger_cascade_soft_delete_client
  AFTER UPDATE OF deleted_at ON clients
  FOR EACH ROW
  WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
  EXECUTE FUNCTION cascade_soft_delete_client();

-- Function to cascade soft delete from projects to milestones and project_members
CREATE OR REPLACE FUNCTION cascade_soft_delete_project()
RETURNS TRIGGER AS $$
BEGIN
  -- Soft delete all milestones belonging to this project
  UPDATE milestones
  SET deleted_at = NEW.deleted_at
  WHERE project_id = NEW.id
    AND deleted_at IS NULL;
  
  -- Soft delete all project members
  UPDATE project_members
  SET deleted_at = NEW.deleted_at
  WHERE project_id = NEW.id
    AND deleted_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects table
DROP TRIGGER IF EXISTS trigger_cascade_soft_delete_project ON projects;
CREATE TRIGGER trigger_cascade_soft_delete_project
  AFTER UPDATE OF deleted_at ON projects
  FOR EACH ROW
  WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
  EXECUTE FUNCTION cascade_soft_delete_project();

-- Function to cascade soft delete from milestones to milestone_members
CREATE OR REPLACE FUNCTION cascade_soft_delete_milestone()
RETURNS TRIGGER AS $$
BEGIN
  -- Soft delete all milestone members
  UPDATE milestone_members
  SET deleted_at = NEW.deleted_at
  WHERE milestone_id = NEW.id
    AND deleted_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for milestones table
DROP TRIGGER IF EXISTS trigger_cascade_soft_delete_milestone ON milestones;
CREATE TRIGGER trigger_cascade_soft_delete_milestone
  AFTER UPDATE OF deleted_at ON milestones
  FOR EACH ROW
  WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
  EXECUTE FUNCTION cascade_soft_delete_milestone();

-- Function to cascade soft delete from employees to project_members and milestone_members
CREATE OR REPLACE FUNCTION cascade_soft_delete_employee()
RETURNS TRIGGER AS $$
BEGIN
  -- Soft delete all project memberships
  UPDATE project_members
  SET deleted_at = NEW.deleted_at
  WHERE employee_id = NEW.id
    AND deleted_at IS NULL;
  
  -- Soft delete all milestone memberships
  UPDATE milestone_members
  SET deleted_at = NEW.deleted_at
  WHERE employee_id = NEW.id
    AND deleted_at IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for employees table
DROP TRIGGER IF EXISTS trigger_cascade_soft_delete_employee ON employees;
CREATE TRIGGER trigger_cascade_soft_delete_employee
  AFTER UPDATE OF deleted_at ON employees
  FOR EACH ROW
  WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
  EXECUTE FUNCTION cascade_soft_delete_employee();

-- Recreate materialized view to use triggers (no change needed, just documenting dependency)
-- The employee_project_access view already filters deleted_at IS NULL
-- The triggers will automatically soft-delete related records when needed

-- Note: Companies and Users tables don't have direct dependents that need cascading
-- - Companies are standalone master data
-- - Users → employees relationship is handled by the employee cascade trigger
