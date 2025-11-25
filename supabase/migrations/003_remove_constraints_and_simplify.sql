-- Migration to simplify database schema
-- 1. Convert VARCHAR to TEXT and remove constraints
-- 2. Remove all functions
-- 3. Remove all triggers

-- ============================================
-- STEP 1: Drop all CHECK constraints FIRST
-- ============================================

-- Drop constraints on clients
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_title_check;
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_gender_check;

-- Drop constraints on projects  
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_paymentterms_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS "projects_paymentTerms_check";
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_priority_check;

-- Drop constraints on milestones
ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_status_check;

-- Drop constraints on payments
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_method_check;

-- Drop constraints on employees
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_title_check;
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_gender_check;

-- Drop constraints on communication_logs
ALTER TABLE communication_logs DROP CONSTRAINT IF EXISTS communication_logs_channel_check;

-- ============================================
-- STEP 2: Drop all triggers
-- ============================================

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_milestones_updated_at ON milestones;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
DROP TRIGGER IF EXISTS update_communication_logs_updated_at ON communication_logs;

-- ============================================
-- STEP 3: Drop all functions
-- ============================================

DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================
-- STEP 4: Alter tables to use TEXT
-- ============================================

-- Clients table
ALTER TABLE clients
  ALTER COLUMN name TYPE TEXT,
  ALTER COLUMN title TYPE TEXT,
  ALTER COLUMN "familyName" TYPE TEXT,
  ALTER COLUMN gender TYPE TEXT,
  ALTER COLUMN "phoneNumber" TYPE TEXT,
  ALTER COLUMN email TYPE TEXT;

-- Companies table
ALTER TABLE companies
  ALTER COLUMN name TYPE TEXT,
  ALTER COLUMN email TYPE TEXT,
  ALTER COLUMN "phoneNumber" TYPE TEXT;

-- Projects table
ALTER TABLE projects
  ALTER COLUMN name TYPE TEXT,
  ALTER COLUMN type TYPE TEXT,
  ALTER COLUMN budget TYPE TEXT,
  ALTER COLUMN "paymentTerms" TYPE TEXT,
  ALTER COLUMN status TYPE TEXT,
  ALTER COLUMN priority TYPE TEXT;

-- Milestones table
ALTER TABLE milestones
  ALTER COLUMN name TYPE TEXT,
  ALTER COLUMN status TYPE TEXT;

-- Payments table
ALTER TABLE payments
  ALTER COLUMN amount TYPE TEXT,
  ALTER COLUMN status TYPE TEXT,
  ALTER COLUMN method TYPE TEXT;

-- Employees table
ALTER TABLE employees
  ALTER COLUMN title TYPE TEXT,
  ALTER COLUMN name TYPE TEXT,
  ALTER COLUMN "familyName" TYPE TEXT,
  ALTER COLUMN "preferredName" TYPE TEXT,
  ALTER COLUMN gender TYPE TEXT,
  ALTER COLUMN "phoneNumber" TYPE TEXT,
  ALTER COLUMN email TYPE TEXT;

-- Communication Logs table
ALTER TABLE communication_logs
  ALTER COLUMN channel TYPE TEXT;

-- ============================================
-- Note: UNIQUE constraints and foreign keys are kept
-- as they are typically necessary for data integrity
-- ============================================
