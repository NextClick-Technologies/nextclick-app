import {
  Client,
  Title,
  Gender,
  ClientStatus,
} from "@/features/clients/domain/types";
import type {
  Client as DbClient,
  ClientInsert as DbClientInsert,
  ClientUpdate as DbClientUpdate,
} from "@/shared/types/database.type";

/**
 * Mock Client data (frontend - camelCase)
 */
export const mockClient: Client = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "John",
  title: Title.MR,
  familyName: "Doe",
  gender: Gender.MALE,
  phoneNumber: "+1234567890",
  email: "john.doe@example.com",
  totalContractValue: 50000,
  joinDate: "2024-01-15",
  companyId: "550e8400-e29b-41d4-a716-446655440101",
  status: ClientStatus.ACTIVE,
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
  company: {
    id: "550e8400-e29b-41d4-a716-446655440101",
    name: "Acme Corporation",
  },
};

export const mockClient2: Client = {
  id: "550e8400-e29b-41d4-a716-446655440002",
  name: "Jane",
  title: Title.MS,
  familyName: "Smith",
  gender: Gender.FEMALE,
  phoneNumber: "+1234567891",
  email: "jane.smith@example.com",
  totalContractValue: 75000,
  joinDate: "2024-02-20",
  companyId: "550e8400-e29b-41d4-a716-446655440101",
  status: ClientStatus.ACTIVE,
  createdAt: "2024-02-20T10:00:00.000Z",
  updatedAt: "2024-02-20T10:00:00.000Z",
  company: {
    id: "550e8400-e29b-41d4-a716-446655440101",
    name: "Acme Corporation",
  },
};

export const mockClients: Client[] = [mockClient, mockClient2];

/**
 * Mock Client data (database - snake_case)
 */
export const mockDbClient: DbClient = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "John",
  title: Title.MR,
  family_name: "Doe",
  gender: Gender.MALE,
  phone_number: "+1234567890",
  email: "john.doe@example.com",
  total_contract_value: 50000,
  join_date: "2024-01-15",
  company_id: "550e8400-e29b-41d4-a716-446655440101",
  status: ClientStatus.ACTIVE,
  created_at: "2024-01-15T10:00:00.000Z",
  updated_at: "2024-01-15T10:00:00.000Z",
};

export const mockDbClients: DbClient[] = [
  mockDbClient,
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Jane",
    title: Title.MS,
    family_name: "Smith",
    gender: Gender.FEMALE,
    phone_number: "+1234567891",
    email: "jane.smith@example.com",
    total_contract_value: 75000,
    join_date: "2024-02-20",
    company_id: "550e8400-e29b-41d4-a716-446655440101",
    status: ClientStatus.ACTIVE,
    created_at: "2024-02-20T10:00:00.000Z",
    updated_at: "2024-02-20T10:00:00.000Z",
  },
];

/**
 * Mock Client insert data
 */
export const mockClientInsert: DbClientInsert = {
  name: "Robert",
  title: Title.DR,
  family_name: "Johnson",
  gender: Gender.MALE,
  phone_number: "+1234567892",
  email: "robert.johnson@example.com",
  total_contract_value: 100000,
  join_date: "2024-03-10",
  company_id: "550e8400-e29b-41d4-a716-446655440101",
  status: ClientStatus.PENDING,
};

/**
 * Mock Client update data
 */
export const mockClientUpdate: DbClientUpdate = {
  status: ClientStatus.INACTIVE,
  total_contract_value: 60000,
  updated_at: new Date().toISOString(),
};

/**
 * Mock Client form input (camelCase)
 */
export const mockClientInput = {
  name: "Robert",
  title: Title.DR,
  familyName: "Johnson",
  gender: Gender.MALE,
  phoneNumber: "+1234567892",
  email: "robert.johnson@example.com",
  totalContractValue: 100000,
  joinDate: "2024-03-10",
  companyId: "550e8400-e29b-41d4-a716-446655440101",
  status: ClientStatus.PENDING,
};
