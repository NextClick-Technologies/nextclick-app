import { Payment, PaymentStatus, PaymentMethod } from "@/features/payment/domain/types/payment.type";
import type {
  Payment as DbPayment,
  PaymentInsert as DbPaymentInsert,
  PaymentUpdate as DbPaymentUpdate,
} from "@/shared/types/database.type";

/**
 * Mock Payment data (frontend - camelCase)
 */
export const mockPayment: Payment = {
  id: "550e8400-e29b-41d4-a716-446655440501",
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  amount: "15000",
  paymentDate: "2024-02-15",
  paymentMethod: PaymentMethod.BANK_TRANSFER,
  status: PaymentStatus.COMPLETED,
  notes: "Initial payment - 30% of project budget",
  createdAt: "2024-02-15T10:00:00.000Z",
  updatedAt: "2024-02-15T10:00:00.000Z",
};

export const mockPayment2: Payment = {
  id: "550e8400-e29b-41d4-a716-446655440502",
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  amount: "20000",
  paymentDate: "2024-03-15",
  paymentMethod: PaymentMethod.CREDIT_CARD,
  status: PaymentStatus.PENDING,
  notes: "Second milestone payment",
  createdAt: "2024-03-15T10:00:00.000Z",
  updatedAt: "2024-03-15T10:00:00.000Z",
};

export const mockPayments: Payment[] = [mockPayment, mockPayment2];

/**
 * Mock Payment data (database - snake_case)
 */
export const mockDbPayment: DbPayment = {
  id: "550e8400-e29b-41d4-a716-446655440501",
  project_id: "550e8400-e29b-41d4-a716-446655440201",
  description: "Initial payment - 30% of project budget",
  amount: "15000",
  date: "2024-02-15",
  method: PaymentMethod.BANK_TRANSFER,
  status: PaymentStatus.COMPLETED,
  created_at: "2024-02-15T10:00:00.000Z",
  updated_at: "2024-02-15T10:00:00.000Z",
};

/**
 * Mock Payment insert data
 */
export const mockPaymentInsert: DbPaymentInsert = {
  project_id: "550e8400-e29b-41d4-a716-446655440201",
  description: "Final payment",
  amount: "15000",
  date: "2024-04-15",
  method: PaymentMethod.BANK_TRANSFER,
  status: PaymentStatus.PENDING,
};

/**
 * Mock Payment update data
 */
export const mockPaymentUpdate: DbPaymentUpdate = {
  status: PaymentStatus.COMPLETED,
  updated_at: new Date().toISOString(),
};
