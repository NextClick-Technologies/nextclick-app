import {
  Project,
  PaymentTerms,
  ProjectStatus,
  ProjectPriority,
} from "@/types/project.type";
import type {
  Project as DbProject,
  ProjectInsert as DbProjectInsert,
  ProjectUpdate as DbProjectUpdate,
} from "@/types/database.type";

/**
 * Mock Project data (frontend - camelCase)
 */
export const mockProject: Project = {
  id: "550e8400-e29b-41d4-a716-446655440201",
  name: "Website Redesign",
  type: "Web Development",
  startDate: "2024-01-20",
  finishDate: "2024-04-20",
  budget: "50000",
  paymentTerms: PaymentTerms.NET_30D,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.HIGH,
  description: "Complete website redesign with modern UI/UX",
  completionDate: null,
  clientId: "550e8400-e29b-41d4-a716-446655440001",
  projectManager: "Sarah Manager",
  createdAt: "2024-01-20T10:00:00.000Z",
  updatedAt: "2024-01-20T10:00:00.000Z",
  client: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "John Doe",
    familyName: "Doe",
  },
};

export const mockProject2: Project = {
  id: "550e8400-e29b-41d4-a716-446655440202",
  name: "Mobile App Development",
  type: "Mobile Development",
  startDate: "2024-02-01",
  finishDate: "2024-06-01",
  budget: "100000",
  paymentTerms: PaymentTerms.NET_60D,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.URGENT,
  description: "Native mobile app for iOS and Android",
  completionDate: null,
  clientId: "550e8400-e29b-41d4-a716-446655440002",
  projectManager: "Mike Lead",
  createdAt: "2024-02-01T10:00:00.000Z",
  updatedAt: "2024-02-01T10:00:00.000Z",
  client: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Jane Smith",
    familyName: "Smith",
  },
};

export const mockProjects: Project[] = [mockProject, mockProject2];

/**
 * Mock Project data (database - snake_case)
 */
export const mockDbProject: DbProject = {
  id: "550e8400-e29b-41d4-a716-446655440201",
  name: "Website Redesign",
  type: "Web Development",
  start_date: "2024-01-20",
  finish_date: "2024-04-20",
  budget: "50000",
  payment_terms: PaymentTerms.NET_30D,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.HIGH,
  description: "Complete website redesign with modern UI/UX",
  completion_date: null,
  client_id: "550e8400-e29b-41d4-a716-446655440001",
  project_manager: "Sarah Manager",
  created_at: "2024-01-20T10:00:00.000Z",
  updated_at: "2024-01-20T10:00:00.000Z",
};

export const mockDbProjects: DbProject[] = [
  mockDbProject,
  {
    id: "550e8400-e29b-41d4-a716-446655440202",
    name: "Mobile App Development",
    type: "Mobile Development",
    start_date: "2024-02-01",
    finish_date: "2024-06-01",
    budget: "100000",
    payment_terms: PaymentTerms.NET_60D,
    status: ProjectStatus.ACTIVE,
    priority: ProjectPriority.URGENT,
    description: "Native mobile app for iOS and Android",
    completion_date: null,
    client_id: "550e8400-e29b-41d4-a716-446655440002",
    project_manager: "Mike Lead",
    created_at: "2024-02-01T10:00:00.000Z",
    updated_at: "2024-02-01T10:00:00.000Z",
  },
];

/**
 * Mock Project insert data
 */
export const mockProjectInsert: DbProjectInsert = {
  name: "API Development",
  type: "Backend Development",
  start_date: "2024-03-01",
  finish_date: "2024-05-01",
  budget: "75000",
  payment_terms: PaymentTerms.NET_30D,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.MEDIUM,
  description: "RESTful API development with authentication",
  client_id: "550e8400-e29b-41d4-a716-446655440001",
  project_manager: "Tom Developer",
};

/**
 * Mock Project update data
 */
export const mockProjectUpdate: DbProjectUpdate = {
  status: ProjectStatus.COMPLETED,
  completion_date: "2024-04-15",
  updated_at: new Date().toISOString(),
};

/**
 * Mock Project form input (camelCase)
 */
export const mockProjectInput = {
  name: "API Development",
  type: "Backend Development",
  startDate: "2024-03-01",
  finishDate: "2024-05-01",
  budget: "75000",
  paymentTerms: PaymentTerms.NET_30D,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.MEDIUM,
  description: "RESTful API development with authentication",
  clientId: "550e8400-e29b-41d4-a716-446655440001",
  projectManager: "Tom Developer",
};
