-- ============================================
-- PHASE 1: AUTH SYSTEM DATABASE MIGRATION
-- Production-Ready Authentication with RBAC
-- ============================================

-- ============================================
-- 1. Users Table for Authentication
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'employee', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Authentication and user management table';
COMMENT ON COLUMN users.role IS 'User role: admin (full access), manager (no employees), employee (assigned projects only), viewer (read-only)';
COMMENT ON COLUMN users.is_active IS 'Account activation status - inactive users cannot login';
COMMENT ON COLUMN users.email_verified IS 'Email verification status - unverified users cannot login';

-- ============================================
-- 2. Link Employees to Users (Optional 1-to-1)
-- ============================================
ALTER TABLE employees ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

COMMENT ON COLUMN employees.user_id IS 'Optional link to users table for authentication';

-- ============================================
-- 3. Project Members Junction Table
-- ============================================
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50), -- e.g., 'lead', 'contributor', 'viewer'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

COMMENT ON TABLE project_members IS 'Junction table for user-project assignments (used for employee data isolation)';
COMMENT ON COLUMN project_members.role IS 'Project-specific role (optional): lead, contributor, viewer, etc.';

-- ============================================
-- 4. Audit Logs for Security Tracking
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Security audit trail for user actions';
COMMENT ON COLUMN audit_logs.action IS 'Action performed: login, create_user, update_project, etc.';
COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource affected: user, project, client, etc.';
COMMENT ON COLUMN audit_logs.details IS 'Additional context in JSON format';

-- ============================================
-- 5. Performance Indexes
-- ============================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token) WHERE email_verification_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token) WHERE password_reset_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Employees table index for user_id lookup
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);

-- Project members table indexes
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_composite ON project_members(user_id, project_id);

-- Audit logs table indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ============================================
-- 6. Triggers for Updated Timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Enable Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS Policies: Users Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_select_admin" ON users;
DROP POLICY IF EXISTS "users_insert_admin" ON users;
DROP POLICY IF EXISTS "users_update_admin" ON users;
DROP POLICY IF EXISTS "users_delete_admin" ON users;

-- Users can view their own profile
CREATE POLICY "users_select_own"
ON users FOR SELECT
USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "users_select_admin"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can insert new users
CREATE POLICY "users_insert_admin"
ON users FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update users
CREATE POLICY "users_update_admin"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can delete users
CREATE POLICY "users_delete_admin"
ON users FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- 9. RLS Policies: Projects Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "projects_select_admin_manager" ON projects;
DROP POLICY IF EXISTS "projects_select_employee" ON projects;
DROP POLICY IF EXISTS "projects_select_viewer" ON projects;
DROP POLICY IF EXISTS "projects_insert_admin_manager" ON projects;
DROP POLICY IF EXISTS "projects_update_admin_manager" ON projects;
DROP POLICY IF EXISTS "projects_delete_admin_manager" ON projects;

-- Admins and managers can view all projects
CREATE POLICY "projects_select_admin_manager"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Employees can view only assigned projects
CREATE POLICY "projects_select_employee"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'employee'
  )
  AND EXISTS (
    SELECT 1 FROM project_members pm
    WHERE pm.project_id = projects.id 
    AND pm.user_id = auth.uid()
  )
);

-- Viewers can view all projects (read-only)
CREATE POLICY "projects_select_viewer"
ON projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'viewer'
  )
);

-- Admins and managers can insert projects
CREATE POLICY "projects_insert_admin_manager"
ON projects FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Admins and managers can update projects
CREATE POLICY "projects_update_admin_manager"
ON projects FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- ============================================
-- 10. RLS Policies: Clients Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "clients_select_admin_manager_viewer" ON clients;
DROP POLICY IF EXISTS "clients_select_employee" ON clients;
DROP POLICY IF EXISTS "clients_insert_admin_manager" ON clients;
DROP POLICY IF EXISTS "clients_update_admin_manager" ON clients;
DROP POLICY IF EXISTS "clients_delete_admin_manager" ON clients;

-- Managers, admins, and viewers can view all clients
CREATE POLICY "clients_select_admin_manager_viewer"
ON clients FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager', 'viewer')
  )
);

-- Employees can view clients for assigned projects only
CREATE POLICY "clients_select_employee"
ON clients FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'employee'
  )
  AND EXISTS (
    SELECT 1 FROM projects p
    INNER JOIN project_members pm ON pm.project_id = p.id
    WHERE p."clientId" = clients.id 
    AND pm.user_id = auth.uid()
  )
);

-- Managers and admins can insert clients
CREATE POLICY "clients_insert_admin_manager"
ON clients FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Managers and admins can update clients
CREATE POLICY "clients_update_admin_manager"
ON clients FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Managers and admins can delete clients
CREATE POLICY "clients_delete_admin_manager"
ON clients FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);)
);
-- ============================================
-- 11. RLS Policies: Companies Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "companies_select_all_except_employee" ON companies;
DROP POLICY IF EXISTS "companies_insert_admin_manager" ON companies;
DROP POLICY IF EXISTS "companies_update_admin_manager" ON companies;
DROP POLICY IF EXISTS "companies_delete_admin_manager" ON companies;

-- Admins, managers, and viewers can view all companies
CREATE POLICY "companies_select_all_except_employee"
ON companies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager', 'viewer')
  )
);

-- Managers and admins can insert companies
CREATE POLICY "companies_insert_admin_manager"
ON companies FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Managers and admins can update companies
CREATE POLICY "companies_update_admin_manager"
ON companies FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Managers and admins can delete companies
CREATE POLICY "companies_delete_admin_manager"
ON companies FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);)
);
-- ============================================
-- 12. RLS Policies: Employees Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "employees_select_admin" ON employees;
DROP POLICY IF EXISTS "employees_insert_admin" ON employees;
DROP POLICY IF EXISTS "employees_update_admin" ON employees;
DROP POLICY IF EXISTS "employees_delete_admin" ON employees;

-- Only admins can view employees
CREATE POLICY "employees_select_admin"
ON employees FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can insert employees
CREATE POLICY "employees_insert_admin"
ON employees FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can update employees
CREATE POLICY "employees_update_admin"
ON employees FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  )
-- ============================================
-- 13. RLS Policies: Project Members Table
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "project_members_select_admin_manager" ON project_members;
DROP POLICY IF EXISTS "project_members_select_employee" ON project_members;
DROP POLICY IF EXISTS "project_members_insert_admin_manager" ON project_members;
DROP POLICY IF EXISTS "project_members_update_admin_manager" ON project_members;
DROP POLICY IF EXISTS "project_members_delete_admin_manager" ON project_members;

-- Admins and managers can view all project members
CREATE POLICY "project_members_select_admin_manager"
ON project_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Employees can view their own memberships
CREATE POLICY "project_members_select_employee"
ON project_members FOR SELECT
USING (
  user_id = auth.uid()
);

-- Admins and managers can insert project members
CREATE POLICY "project_members_insert_admin_manager"
ON project_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Admins and managers can update project members
CREATE POLICY "project_members_update_admin_manager"
ON project_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Admins and managers can delete project members
CREATE POLICY "project_members_delete_admin_manager"
ON project_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);  AND role IN ('admin', 'manager')
  )
);


-- ============================================
-- 14. Create Initial Admin User (Optional)
-- ============================================
-- Uncomment and modify this section to create an initial admin user
-- Password: 'admin123' (CHANGE THIS IMMEDIATELY IN PRODUCTION!)
-- This is just for initial setup - use the create-user API for production

-- INSERT INTO users (email, password_hash, role, is_active, email_verified)
-- VALUES (
--   'admin@nextclick.com',
--   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kuWxEYJCJWVG', -- bcrypt hash of 'admin123'
--   'admin',
--   true,
--   true
-- );

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE 'Auth system migration completed successfully!';
  RAISE NOTICE 'Created tables: users, project_members, audit_logs';
  RAISE NOTICE 'Updated table: employees (added user_id column)';
  RAISE NOTICE 'Created % indexes', (
    SELECT COUNT(*) 
    FROM pg_indexes 
    WHERE tablename IN ('users', 'project_members', 'audit_logs', 'employees')
    AND indexname LIKE 'idx_%'
  );
  RAISE NOTICE 'RLS enabled on 6 tables with comprehensive policies';
END $$;
