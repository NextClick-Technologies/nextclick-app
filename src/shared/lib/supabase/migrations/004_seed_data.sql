-- Seed data for all tables
-- This migration adds 5 sample records to each table
-- Note: Run migration 003 first to remove constraints, or ensure constraint values match schema

-- ============================================
-- Seed Clients (5 records)
-- ============================================

INSERT INTO clients (id, name, title, "familyName", gender, "phoneNumber", email, "createdAt", "updatedAt") VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'John', 'mr', 'Doe', 'male', '+1-555-0101', 'john.doe@email.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Jane', 'ms', 'Smith', 'female', '+1-555-0102', 'jane.smith@email.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Robert', 'dr', 'Johnson', 'male', '+1-555-0103', 'robert.johnson@email.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'Emily', 'mrs', 'Williams', 'female', '+1-555-0104', 'emily.williams@email.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'Michael', 'prof', 'Brown', 'male', '+1-555-0105', 'michael.brown@email.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Seed Companies (5 records)
-- ============================================

INSERT INTO companies (id, name, email, address, "phoneNumber", "createdAt", "updatedAt") VALUES
('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 'Tech Solutions Inc', 'contact@techsolutions.com', '123 Innovation Drive, Silicon Valley, CA 94025', '+1-555-1001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'Global Enterprises LLC', 'info@globalenterprises.com', '456 Business Park, New York, NY 10001', '+1-555-1002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 'Digital Innovations Corp', 'hello@digitalinnov.com', '789 Tech Boulevard, Austin, TX 78701', '+1-555-1003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'Creative Studios Ltd', 'contact@creativestudios.com', '321 Design Street, Los Angeles, CA 90001', '+1-555-1004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a', 'Future Systems Group', 'support@futuresystems.com', '654 Enterprise Way, Seattle, WA 98101', '+1-555-1005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Seed Employees (5 records)
-- ============================================

INSERT INTO employees (id, title, name, "familyName", "preferredName", gender, "phoneNumber", email, photo, "userId", "createdAt", "updatedAt") VALUES
('e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b', 'mr', 'David', 'Anderson', 'Dave', 'male', '+1-555-2001', 'david.anderson@company.com', 'https://i.pravatar.cc/150?img=1', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c', 'ms', 'Sarah', 'Martinez', 'Sarah', 'female', '+1-555-2002', 'sarah.martinez@company.com', 'https://i.pravatar.cc/150?img=2', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a3b4c5d6-e7f8-4a5b-0c1d-2e3f4a5b6c7d', 'mr', 'James', 'Taylor', 'Jim', 'male', '+1-555-2003', 'james.taylor@company.com', 'https://i.pravatar.cc/150?img=3', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b4c5d6e7-f8a9-4b5c-1d2e-3f4a5b6c7d8e', 'mrs', 'Lisa', 'Thomas', 'Lisa', 'female', '+1-555-2004', 'lisa.thomas@company.com', 'https://i.pravatar.cc/150?img=4', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c5d6e7f8-a9b0-4c5d-2e3f-4a5b6c7d8e9f', 'mr', 'Christopher', 'Garcia', 'Chris', 'male', '+1-555-2005', 'chris.garcia@company.com', 'https://i.pravatar.cc/150?img=5', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Seed Projects (5 records)
-- ============================================

INSERT INTO projects (id, name, type, "startDate", "finishDate", budget, "paymentTerms", status, priority, description, "completionDate", "clientId", "createdAt", "updatedAt") VALUES
('d6e7f8a9-b0c1-4d5e-3f4a-5b6c7d8e9f0a', 'Website Redesign', 'Web Development', '2024-01-15 00:00:00+00', '2024-06-30 00:00:00+00', '50000', 'net_30d', 'active', 'high', 'Complete redesign of corporate website with modern UI/UX', NULL, 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e7f8a9b0-c1d2-4e5f-4a5b-6c7d8e9f0a1b', 'Mobile App Development', 'Mobile Development', '2024-02-01 00:00:00+00', '2024-08-31 00:00:00+00', '75000', 'net_60d', 'active', 'urgent', 'Native iOS and Android app for customer engagement', NULL, 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f8a9b0c1-d2e3-4f5a-5b6c-7d8e9f0a1b2c', 'Cloud Migration', 'Infrastructure', '2023-10-01 00:00:00+00', '2024-03-31 00:00:00+00', '120000', 'net_30d', 'completed', 'medium', 'Migration of legacy systems to AWS cloud infrastructure', '2024-03-25 00:00:00+00', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d', 'CRM Implementation', 'Software Integration', '2024-03-01 00:00:00+00', '2024-09-30 00:00:00+00', '65000', 'net_90d', 'active', 'high', 'Implementation and customization of Salesforce CRM', NULL, 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b0c1d2e3-f4a5-4b5c-7d8e-9f0a1b2c3d4e', 'Data Analytics Platform', 'Data Science', '2024-01-01 00:00:00+00', '2024-12-31 00:00:00+00', '95000', 'immediate', 'on_hold', 'low', 'Development of custom analytics dashboard and reporting tools', NULL, 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Seed Milestones (5 records)
-- ============================================

INSERT INTO milestones (id, name, description, "startDate", "finishDate", "completionDate", status, remarks, "projectId", "createdAt", "updatedAt") VALUES
('c1d2e3f4-a5b6-4c5d-8e9f-0a1b2c3d4e5f', 'Initial Design Phase', 'Complete UI/UX mockups and wireframes', '2024-01-15 00:00:00+00', '2024-02-15 00:00:00+00', '2024-02-10 00:00:00+00', 'completed', 'Completed ahead of schedule', 'd6e7f8a9-b0c1-4d5e-3f4a-5b6c7d8e9f0a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d2e3f4a5-b6c7-4d5e-9f0a-1b2c3d4e5f6a', 'Frontend Development', 'Build responsive frontend components', '2024-02-16 00:00:00+00', '2024-04-30 00:00:00+00', NULL, 'in_progress', 'Currently 60% complete', 'd6e7f8a9-b0c1-4d5e-3f4a-5b6c7d8e9f0a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e3f4a5b6-c7d8-4e5f-0a1b-2c3d4e5f6a7b', 'iOS Development', 'Develop and test iOS application', '2024-02-01 00:00:00+00', '2024-05-31 00:00:00+00', NULL, 'in_progress', 'Beta version ready for testing', 'e7f8a9b0-c1d2-4e5f-4a5b-6c7d8e9f0a1b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f4a5b6c7-d8e9-4f5a-1b2c-3d4e5f6a7b8c', 'Data Migration', 'Transfer all data to new cloud infrastructure', '2023-11-01 00:00:00+00', '2024-02-28 00:00:00+00', '2024-02-25 00:00:00+00', 'completed', 'Successfully migrated 500GB of data', 'f8a9b0c1-d2e3-4f5a-5b6c-7d8e9f0a1b2c', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a5b6c7d8-e9f0-4a5b-2c3d-4e5f6a7b8c9d', 'CRM Configuration', 'Configure Salesforce modules and workflows', '2024-03-01 00:00:00+00', '2024-05-31 00:00:00+00', NULL, 'pending', 'Waiting for client requirements finalization', 'a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Seed Payments (5 records)
-- ============================================

INSERT INTO payments (id, description, amount, status, date, method, "projectId", "createdAt", "updatedAt") VALUES
('b6c7d8e9-f0a1-4b5c-3d4e-5f6a7b8c9d0e', 'Initial deposit for website redesign', '15000', 'completed', '2024-01-15 00:00:00+00', 'bank_transfer', 'd6e7f8a9-b0c1-4d5e-3f4a-5b6c7d8e9f0a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c7d8e9f0-a1b2-4c5d-4e5f-6a7b8c9d0e1f', 'Milestone 1 payment', '17500', 'completed', '2024-02-20 00:00:00+00', 'credit_card', 'd6e7f8a9-b0c1-4d5e-3f4a-5b6c7d8e9f0a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d8e9f0a1-b2c3-4d5e-5f6a-7b8c9d0e1f2a', 'Mobile app development - Phase 1', '30000', 'completed', '2024-03-01 00:00:00+00', 'bank_transfer', 'e7f8a9b0-c1d2-4e5f-4a5b-6c7d8e9f0a1b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e9f0a1b2-c3d4-4e5f-6a7b-8c9d0e1f2a3b', 'Cloud migration final payment', '50000', 'completed', '2024-04-15 00:00:00+00', 'cheque', 'f8a9b0c1-d2e3-4f5a-5b6c-7d8e9f0a1b2c', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0a1b2c3-d4e5-4f5a-7b8c-9d0e1f2a3b4c', 'CRM implementation deposit', '20000', 'pending', '2024-05-01 00:00:00+00', 'bank_transfer', 'a9b0c1d2-e3f4-4a5b-6c7d-8e9f0a1b2c3d', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Seed Communication Logs (5 records)
-- ============================================

INSERT INTO communication_logs (id, date, channel, summary, "followUpRequired", "followUpDate", "clientId", "employeeId", "createdAt", "updatedAt") VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '2024-01-10 10:00:00+00', 'meeting', 'Initial project kickoff meeting. Discussed requirements and timeline.', true, '2024-01-17 10:00:00+00', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '2024-02-05 14:30:00+00', 'email', 'Sent design mockups for review and approval.', true, '2024-02-12 14:30:00+00', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '2024-03-15 11:00:00+00', 'video_call', 'Weekly progress update with client. Demo of mobile app prototype.', false, NULL, 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'a3b4c5d6-e7f8-4a5b-0c1d-2e3f4a5b6c7d', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '2024-04-01 09:30:00+00', 'phone', 'Discussed payment terms and contract extension.', true, '2024-04-08 09:30:00+00', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'b4c5d6e7-f8a9-4b5c-1d2e-3f4a5b6c7d8e', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', '2024-04-20 16:00:00+00', 'chat', 'Quick clarification on analytics dashboard requirements.', false, NULL, 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c5d6e7f8-a9b0-4c5d-2e3f-4a5b6c7d8e9f', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
