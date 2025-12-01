/**
 * Payment type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

// Payment Status enum values
export const PaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// Payment Method enum values
export const PaymentMethod = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  CHEQUE: "cheque",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface Payment {
  id: string;
  projectId: string;
  amount: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
