-- Seed data for Next Click ERP
-- Using gen_random_uuid() for all IDs and DO block for foreign key references

-- Clear existing data (optional - comment out if you want to preserve data)
-- TRUNCATE communication_logs, payments, milestones, projects, employees, clients, companies CASCADE;

DO $$
DECLARE
  -- Client IDs
  client_id_john UUID;
  client_id_jorge UUID;
  client_id_maria UUID;
  client_id_robert UUID;
  client_id_sarah UUID;
  client_id_michael UUID;
  client_id_jennifer UUID;
  
  -- Project IDs
  project_id_1 UUID;
  project_id_2 UUID;
  project_id_3 UUID;
  project_id_4 UUID;
  project_id_5 UUID;
  
  -- Employee IDs
  employee_id_1 UUID;
  employee_id_2 UUID;
  employee_id_3 UUID;
  employee_id_4 UUID;
  employee_id_5 UUID;

BEGIN
  -- ==========================================
  -- CLIENTS
  -- ==========================================
  INSERT INTO clients (id, name, title, "familyName", gender, "phoneNumber", email, "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'John', 'mr', 'Doe', 'male', '0420345976', 'john.doe@example.com', NOW(), NOW()),
    (gen_random_uuid(), 'Jorge', 'mr', 'Carvajal', 'male', '0420345976', 'jkk@hoi.lom', NOW(), NOW()),
    (gen_random_uuid(), 'Maria', 'mrs', 'Rodriguez', 'female', '0420345977', 'maria.rodriguez@example.com', NOW(), NOW()),
    (gen_random_uuid(), 'Robert', 'mr', 'Johnson', 'male', '0420345978', 'robert.johnson@example.com', NOW(), NOW()),
    (gen_random_uuid(), 'Sarah', 'ms', 'Williams', 'female', '0420345979', 'sarah.williams@example.com', NOW(), NOW()),
    (gen_random_uuid(), 'Michael', 'mr', 'Brown', 'male', '0420345980', 'michael.brown@example.com', NOW(), NOW()),
    (gen_random_uuid(), 'Jennifer', 'mrs', 'Davis', 'female', '0420345981', 'jennifer.davis@example.com', NOW(), NOW());

  -- Get client IDs
  SELECT id INTO client_id_john FROM clients WHERE email = 'john.doe@example.com';
  SELECT id INTO client_id_jorge FROM clients WHERE email = 'jkk@hoi.lom';
  SELECT id INTO client_id_maria FROM clients WHERE email = 'maria.rodriguez@example.com';
  SELECT id INTO client_id_robert FROM clients WHERE email = 'robert.johnson@example.com';
  SELECT id INTO client_id_sarah FROM clients WHERE email = 'sarah.williams@example.com';
  SELECT id INTO client_id_michael FROM clients WHERE email = 'michael.brown@example.com';
  SELECT id INTO client_id_jennifer FROM clients WHERE email = 'jennifer.davis@example.com';

  -- ==========================================
  -- COMPANIES
  -- ==========================================
  INSERT INTO companies (id, name, email, address, "phoneNumber", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Tech Solutions Inc', 'info@techsolutions.com', '123 Silicon Valley Blvd, San Francisco, CA', '0420345976', NOW(), NOW()),
    (gen_random_uuid(), 'Fajas Salome', 'lkkllk@salome.com', 'crea t4w no 34je', '0420345976', NOW(), NOW()),
    (gen_random_uuid(), 'Global Enterprises', 'contact@global.com', '456 Business Park, New York, NY', '0420345977', NOW(), NOW()),
    (gen_random_uuid(), 'Innovation Labs', 'hello@innovationlabs.com', '789 Innovation Drive, Austin, TX', '0420345978', NOW(), NOW()),
    (gen_random_uuid(), 'Digital Dynamics', 'info@digitaldynamics.com', '321 Tech Street, Seattle, WA', '0420345979', NOW(), NOW());

  -- ==========================================
  -- PROJECTS
  -- ==========================================
  INSERT INTO projects (id, name, type, "startDate", "finishDate", budget, "paymentTerms", status, priority, description, "completionDate", "clientId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'E-Commerce Platform', 'development', '2025-01-15', '2025-06-30', '150000.00', 'net_30d', 'active', 'high', 'Build a comprehensive e-commerce platform with payment integration and inventory management.', NULL, client_id_jorge, NOW(), NOW()),
    (gen_random_uuid(), 'Mobile App Development', 'development', '2025-02-01', '2025-08-31', '200000.00', 'net_60d', 'active', 'high', 'Develop iOS and Android mobile applications for customer engagement.', NULL, client_id_maria, NOW(), NOW()),
    (gen_random_uuid(), 'Website Redesign', 'development', '2025-08-14', '2025-09-26', '822819.00', 'net_30d', 'cancelled', 'low', 'Complete website redesign with modern UI/UX principles.', '2026-07-04', client_id_jorge, NOW(), NOW()),
    (gen_random_uuid(), 'Data Analytics Dashboard', 'consulting', '2025-03-01', '2025-07-31', '180000.00', 'net_30d', 'active', 'medium', 'Create real-time analytics dashboard with advanced reporting features.', NULL, client_id_robert, NOW(), NOW()),
    (gen_random_uuid(), 'Cloud Migration Project', 'migration', '2025-04-01', '2025-12-31', '500000.00', 'net_60d', 'active', 'high', 'Migrate entire infrastructure to cloud platform with zero downtime.', NULL, client_id_sarah, NOW(), NOW());

  -- Get project IDs
  SELECT id INTO project_id_1 FROM projects WHERE name = 'E-Commerce Platform';
  SELECT id INTO project_id_2 FROM projects WHERE name = 'Mobile App Development';
  SELECT id INTO project_id_3 FROM projects WHERE name = 'Website Redesign';
  SELECT id INTO project_id_4 FROM projects WHERE name = 'Data Analytics Dashboard';
  SELECT id INTO project_id_5 FROM projects WHERE name = 'Cloud Migration Project';

  -- ==========================================
  -- MILESTONES
  -- ==========================================
  INSERT INTO milestones (id, name, description, "startDate", "finishDate", "completionDate", status, remarks, "projectId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Requirements Gathering', 'Complete requirements analysis and documentation for the project.', '2025-01-15', '2025-02-15', '2025-02-10', 'completed', 'Completed ahead of schedule', project_id_1, NOW(), NOW()),
    (gen_random_uuid(), 'UI/UX Design', 'Design user interface and user experience mockups.', '2025-02-16', '2025-03-31', NULL, 'in_progress', NULL, project_id_1, NOW(), NOW()),
    (gen_random_uuid(), 'Initial Setup', 'Development environment and initial project setup.', '2026-03-16', '2026-03-16', '2026-05-16', 'cancelled', NULL, project_id_2, NOW(), NOW()),
    (gen_random_uuid(), 'Backend Development', 'Develop backend APIs and database architecture.', '2025-04-01', '2025-05-31', NULL, 'pending', NULL, project_id_1, NOW(), NOW()),
    (gen_random_uuid(), 'Testing Phase', 'Comprehensive testing including unit, integration and UAT.', '2025-06-01', '2025-06-30', NULL, 'pending', NULL, project_id_1, NOW(), NOW());

  -- ==========================================
  -- PAYMENTS
  -- ==========================================
  INSERT INTO payments (id, description, amount, status, date, method, "projectId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Initial project payment - 30% upfront', '45000.00', 'completed', '2025-01-20', 'bank_transfer', project_id_1, NOW(), NOW()),
    (gen_random_uuid(), 'Milestone 1 completion payment', '30000.00', 'completed', '2025-02-25', 'bank_transfer', project_id_1, NOW(), NOW()),
    (gen_random_uuid(), 'Second phase payment', '50000.00', 'pending', '2025-04-15', 'bank_transfer', project_id_2, NOW(), NOW()),
    (gen_random_uuid(), 'Monthly retainer fee', '10000.00', 'completed', '2025-03-01', 'credit_card', project_id_4, NOW(), NOW()),
    (gen_random_uuid(), 'Infrastructure setup payment', '150000.00', 'completed', '2025-04-10', 'bank_transfer', project_id_5, NOW(), NOW());

  -- ==========================================
  -- EMPLOYEES
  -- ==========================================
  INSERT INTO employees (id, title, name, "familyName", "preferredName", gender, "phoneNumber", email, photo, "userId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'mr', 'Edwin', 'Schaefer', 'Taylor', 'male', '919-235-7253', 'edwin.schaefer@company.com', 'https://smart-legend.biz/', NULL, NOW(), NOW()),
    (gen_random_uuid(), 'prof', 'Juan', 'Garcia', 'Juan', 'other', '555-235-7253', 'juan.garcia@company.com', 'https://smart-legend.biz/', NULL, NOW(), NOW()),
    (gen_random_uuid(), 'mrs', 'Emma', 'Thompson', 'Emma', 'female', '555-123-4567', 'emma.thompson@company.com', NULL, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'dr', 'James', 'Wilson', 'Jim', 'male', '555-987-6543', 'james.wilson@company.com', NULL, NULL, NOW(), NOW()),
    (gen_random_uuid(), 'ms', 'Lisa', 'Anderson', 'Lisa', 'female', '555-456-7890', 'lisa.anderson@company.com', NULL, NULL, NOW(), NOW());

  -- Get employee IDs
  SELECT id INTO employee_id_1 FROM employees WHERE email = 'edwin.schaefer@company.com';
  SELECT id INTO employee_id_2 FROM employees WHERE email = 'juan.garcia@company.com';
  SELECT id INTO employee_id_3 FROM employees WHERE email = 'emma.thompson@company.com';
  SELECT id INTO employee_id_4 FROM employees WHERE email = 'james.wilson@company.com';
  SELECT id INTO employee_id_5 FROM employees WHERE email = 'lisa.anderson@company.com';

  -- ==========================================
  -- COMMUNICATION LOGS
  -- ==========================================
  INSERT INTO communication_logs (id, date, channel, summary, "followUpRequired", "followUpDate", "clientId", "employeeId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), '2025-01-10', 'email', 'Initial project discussion. Client expressed interest in e-commerce platform with specific requirements for payment gateway integration.', TRUE, '2025-01-15', client_id_jorge, employee_id_1, NOW(), NOW()),
    (gen_random_uuid(), '2025-08-26', 'chat', 'Follow-up discussion on project timeline and deliverables. Client requested additional features.', TRUE, '2025-12-03', client_id_robert, employee_id_3, NOW(), NOW()),
    (gen_random_uuid(), '2025-02-15', 'meeting', 'Project kickoff meeting. Reviewed timeline, deliverables, and resource allocation. All stakeholders aligned on project goals.', FALSE, NULL, client_id_maria, employee_id_2, NOW(), NOW()),
    (gen_random_uuid(), '2025-03-20', 'phone', 'Weekly status update call. Discussed progress on mobile app development. Client requested additional features for push notifications.', TRUE, '2025-03-27', client_id_maria, employee_id_4, NOW(), NOW()),
    (gen_random_uuid(), '2025-04-05', 'video_call', 'Cloud migration planning session. Reviewed architecture diagrams and migration strategy. Discussed security compliance requirements.', TRUE, '2025-04-12', client_id_sarah, employee_id_5, NOW(), NOW());

END $$;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================
-- Run these to verify the data was inserted correctly
SELECT 'Clients' as table_name, COUNT(*) as record_count FROM clients
UNION ALL
SELECT 'Companies', COUNT(*) FROM companies
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Milestones', COUNT(*) FROM milestones
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Employees', COUNT(*) FROM employees
UNION ALL
SELECT 'Communication Logs', COUNT(*) FROM communication_logs
ORDER BY table_name;
