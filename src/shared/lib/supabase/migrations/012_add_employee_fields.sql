-- Add new fields to employees table
-- Run this in your Supabase SQL Editor

-- Add status column if it doesn't exist (you may have already added this)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='employees' AND column_name='status') THEN
    ALTER TABLE employees 
    ADD COLUMN status TEXT DEFAULT 'active' NOT NULL;
  END IF;
END $$;

-- Add employment information fields
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS join_date DATE,
ADD COLUMN IF NOT EXISTS salary NUMERIC(12, 2);

-- Add emergency contact fields
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS emergency_phone TEXT;

-- Add address fields
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Update existing employees to have active status if null
UPDATE employees 
SET status = 'active' 
WHERE status IS NULL;

-- Add check constraint for status values
ALTER TABLE employees 
ADD CONSTRAINT employees_status_check 
CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated'));

-- Make title nullable if it isn't already
ALTER TABLE employees 
ALTER COLUMN title DROP NOT NULL;

-- Create index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);

-- Add comment to table
COMMENT ON TABLE employees IS 'Employee information with status, employment details, and contact information';
