import { Payment, PaymentStatus, PaymentMethod } from "@/types/payment.type";
import {
  DbPayment,
  DbPaymentInsert,
  DbPaymentUpdate,
} from "@/types/database.type";

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
  amount: "15000",
  payment_date: "2024-02-15",
  payment_method: PaymentMethod.BANK_TRANSFER,
  status: PaymentStatus.COMPLETED,
  notes: "Initial payment - 30% of project budget",
  created_at: "2024-02-15T10:00:00.000Z",
  updated_at: "2024-02-15T10:00:00.000Z",
};

/**
 * Mock Payment insert data
 */
export const mockPaymentInsert: DbPaymentInsert = {
  project_id: "550e8400-e29b-41d4-a716-446655440201",
  amount: "15000",
  payment_date: "2024-04-15",
  payment_method: PaymentMethod.BANK_TRANSFER,
  status: PaymentStatus.PENDING,
  notes: "Final payment",
};

/**
 * Mock Payment update data
 */
export const mockPaymentUpdate: DbPaymentUpdate = {
  status: PaymentStatus.COMPLETED,
  notes: "Payment received successfully",
  updated_at: new Date().toISOString(),
};
