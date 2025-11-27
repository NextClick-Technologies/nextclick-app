import { Employee, EmployeeStatus } from "@/types/employee.type";
import { Title, Gender } from "@/types/client.type";
import {
  DbEmployee,
  DbEmployeeInsert,
  DbEmployeeUpdate,
} from "@/types/database.type";

/**
 * Mock Employee data (frontend - camelCase)
 */
export const mockEmployee: Employee = {
  id: "550e8400-e29b-41d4-a716-446655440301",
  title: Title.MR,
  name: "John",
  familyName: "Smith",
  preferredName: "Johnny",
  gender: Gender.MALE,
  phoneNumber: "+1234567890",
  email: "john.smith@company.com",
  photo: null,
  userId: null,
  status: EmployeeStatus.ACTIVE,
  department: "Engineering",
  position: "Senior Developer",
  joinDate: "2024-01-15",
  salary: 85000,
  emergencyContact: "Jane Smith",
  emergencyPhone: "+1234567891",
  address: "123 Tech Street",
  city: "San Francisco",
  state: "CA",
  zipCode: "94102",
  country: "USA",
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
};

export const mockEmployee2: Employee = {
  id: "550e8400-e29b-41d4-a716-446655440302",
  title: Title.MS,
  name: "Sarah",
  familyName: "Johnson",
  preferredName: null,
  gender: Gender.FEMALE,
  phoneNumber: "+1234567892",
  email: "sarah.johnson@company.com",
  photo: null,
  userId: null,
  status: EmployeeStatus.ACTIVE,
  department: "Marketing",
  position: "Marketing Manager",
  joinDate: "2024-02-01",
  salary: 75000,
  emergencyContact: "Mike Johnson",
  emergencyPhone: "+1234567893",
  address: "456 Business Ave",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  country: "USA",
  createdAt: "2024-02-01T10:00:00.000Z",
  updatedAt: "2024-02-01T10:00:00.000Z",
};

export const mockEmployees: Employee[] = [mockEmployee, mockEmployee2];

/**
 * Mock Employee data (database - snake_case)
 */
export const mockDbEmployee: DbEmployee = {
  id: "550e8400-e29b-41d4-a716-446655440301",
  title: Title.MR,
  name: "John",
  family_name: "Smith",
  preferred_name: "Johnny",
  gender: Gender.MALE,
  phone_number: "+1234567890",
  email: "john.smith@company.com",
  photo: null,
  user_id: null,
  status: EmployeeStatus.ACTIVE,
  department: "Engineering",
  position: "Senior Developer",
  join_date: "2024-01-15",
  salary: 85000,
  emergency_contact: "Jane Smith",
  emergency_phone: "+1234567891",
  address: "123 Tech Street",
  city: "San Francisco",
  state: "CA",
  zip_code: "94102",
  country: "USA",
  created_at: "2024-01-15T10:00:00.000Z",
  updated_at: "2024-01-15T10:00:00.000Z",
};

/**
 * Mock Employee insert data
 */
export const mockEmployeeInsert: DbEmployeeInsert = {
  title: Title.DR,
  name: "Michael",
  family_name: "Brown",
  preferred_name: "Mike",
  gender: Gender.MALE,
  phone_number: "+1234567894",
  email: "michael.brown@company.com",
  status: EmployeeStatus.ACTIVE,
  department: "Engineering",
  position: "Tech Lead",
  join_date: "2024-03-01",
  salary: 95000,
};

/**
 * Mock Employee update data
 */
export const mockEmployeeUpdate: DbEmployeeUpdate = {
  position: "Lead Developer",
  salary: 90000,
  updated_at: new Date().toISOString(),
};
