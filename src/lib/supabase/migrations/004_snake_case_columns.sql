-- Migration: Convert camelCase columns to snake_case
-- This migration renames all multi-word columns from camelCase to snake_case
-- Single-word columns (id, name, title, gender, email, etc.) remain unchanged

-- Drop triggers before renaming columns
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
DROP TRIGGER IF EXISTS update_communication_logs_updated_at ON communication_logs;

-- Drop indexes that reference camelCase columns
DROP INDEX IF EXISTS idx_projects_client_id;
DROP INDEX IF EXISTS idx_milestones_project_id;
DROP INDEX IF EXISTS idx_payments_project_id;
DROP INDEX IF EXISTS idx_communication_logs_client_id;
DROP INDEX IF EXISTS idx_communication_logs_employee_id;

-- CLIENTS TABLE
ALTER TABLE clients RENAME COLUMN "familyName" TO family_name;
ALTER TABLE clients RENAME COLUMN "phoneNumber" TO phone_number;
ALTER TABLE clients RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE clients RENAME COLUMN "updatedAt" TO updated_at;

-- COMPANIES TABLE
ALTER TABLE companies RENAME COLUMN "phoneNumber" TO phone_number;
ALTER TABLE companies RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE companies RENAME COLUMN "updatedAt" TO updated_at;

-- PROJECTS TABLE
ALTER TABLE projects RENAME COLUMN "startDate" TO start_date;
ALTER TABLE projects RENAME COLUMN "finishDate" TO finish_date;
ALTER TABLE projects RENAME COLUMN "paymentTerms" TO payment_terms;
ALTER TABLE projects RENAME COLUMN "completionDate" TO completion_date;
ALTER TABLE projects RENAME COLUMN "clientId" TO client_id;
ALTER TABLE projects RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE projects RENAME COLUMN "updatedAt" TO updated_at;

-- Update CHECK constraint for payment_terms
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_paymentTerms_check;
ALTER TABLE projects ADD CONSTRAINT projects_payment_terms_check 
  CHECK (payment_terms IN ('net_30d', 'net_60d', 'net_90d', 'immediate'));

-- MILESTONES TABLE
ALTER TABLE milestones RENAME COLUMN "startDate" TO start_date;
ALTER TABLE milestones RENAME COLUMN "finishDate" TO finish_date;
ALTER TABLE milestones RENAME COLUMN "completionDate" TO completion_date;
ALTER TABLE milestones RENAME COLUMN "projectId" TO project_id;
ALTER TABLE milestones RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE milestones RENAME COLUMN "updatedAt" TO updated_at;

-- PAYMENTS TABLE
ALTER TABLE payments RENAME COLUMN "projectId" TO project_id;
ALTER TABLE payments RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE payments RENAME COLUMN "updatedAt" TO updated_at;

-- EMPLOYEES TABLE
ALTER TABLE employees RENAME COLUMN "familyName" TO family_name;
ALTER TABLE employees RENAME COLUMN "preferredName" TO preferred_name;
ALTER TABLE employees RENAME COLUMN "phoneNumber" TO phone_number;
ALTER TABLE employees RENAME COLUMN "userId" TO user_id;
ALTER TABLE employees RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE employees RENAME COLUMN "updatedAt" TO updated_at;

-- COMMUNICATION_LOGS TABLE
ALTER TABLE communication_logs RENAME COLUMN "followUpRequired" TO follow_up_required;
ALTER TABLE communication_logs RENAME COLUMN "followUpDate" TO follow_up_date;
ALTER TABLE communication_logs RENAME COLUMN "clientId" TO client_id;
ALTER TABLE communication_logs RENAME COLUMN "employeeId" TO employee_id;
ALTER TABLE communication_logs RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE communication_logs RENAME COLUMN "updatedAt" TO updated_at;

-- Recreate indexes with snake_case column names
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_client_id ON communication_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_employee_id ON communication_logs(employee_id);

-- Update trigger function to use snake_case
DROP FUNCTION IF EXISTS update_updated_at_column();
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate triggers with updated function
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communication_logs_updated_at BEFORE UPDATE ON communication_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
