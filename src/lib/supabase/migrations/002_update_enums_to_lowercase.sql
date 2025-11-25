-- Migration to update enum constraints from UPPERCASE to lowercase
-- This migration drops and recreates all check constraints with lowercase values

-- Drop existing check constraints
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_title_check;
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_gender_check;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_paymentTerms_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_priority_check;

ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_status_check;

ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_status_check;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_method_check;

ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_title_check;
ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_gender_check;

ALTER TABLE communication_logs DROP CONSTRAINT IF EXISTS communication_logs_channel_check;

-- Add new check constraints with lowercase values
ALTER TABLE clients ADD CONSTRAINT clients_title_check 
  CHECK (title IN ('mr', 'mrs', 'ms', 'dr', 'prof', 'sr'));

ALTER TABLE clients ADD CONSTRAINT clients_gender_check 
  CHECK (gender IN ('male', 'female', 'other'));

ALTER TABLE projects ADD CONSTRAINT projects_paymentTerms_check 
  CHECK ("paymentTerms" IN ('net_30d', 'net_60d', 'net_90d', 'immediate'));

ALTER TABLE projects ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled'));

ALTER TABLE projects ADD CONSTRAINT projects_priority_check 
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

ALTER TABLE milestones ADD CONSTRAINT milestones_status_check 
  CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

ALTER TABLE payments ADD CONSTRAINT payments_status_check 
  CHECK (status IN ('pending', 'completed', 'failed'));

ALTER TABLE payments ADD CONSTRAINT payments_method_check 
  CHECK (method IN ('cash', 'bank_transfer', 'credit_card', 'cheque'));

ALTER TABLE employees ADD CONSTRAINT employees_title_check 
  CHECK (title IN ('mr', 'mrs', 'ms', 'dr', 'prof', 'sr'));

ALTER TABLE employees ADD CONSTRAINT employees_gender_check 
  CHECK (gender IN ('male', 'female', 'other'));

ALTER TABLE communication_logs ADD CONSTRAINT communication_logs_channel_check 
  CHECK (channel IN ('email', 'phone', 'chat', 'meeting', 'video_call'));
