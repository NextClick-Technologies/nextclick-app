import { describe, it, expect } from "@jest/globals";
import {
  paymentSchema,
  updatePaymentSchema,
  type PaymentInput,
  type UpdatePaymentInput,
} from "@/features/payment/services/schemas";
import { ZodError } from "zod";

describe("paymentSchema", () => {
  describe("description field", () => {
    it("should accept valid description", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.description).toBe("First milestone payment");
    });

    it("should reject empty description", () => {
      const data = {
        description: "",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("amount field", () => {
    it("should accept valid amount", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.amount).toBe(5000);
    });

    it("should coerce amount from string to number", () => {
      const data = {
        description: "First milestone payment",
        amount: "7500" as any,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.amount).toBe(7500);
    });

    it("should reject amount less than 1", () => {
      const data = {
        description: "First milestone payment",
        amount: 0,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject negative amount", () => {
      const data = {
        description: "First milestone payment",
        amount: -100,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });

    it("should accept decimal amounts", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000.75,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.amount).toBe(5000.75);
    });
  });

  describe("status field", () => {
    it("should accept 'pending' status", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.status).toBe("pending");
    });

    it("should accept 'completed' status", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "completed" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.status).toBe("completed");
    });

    it("should accept 'failed' status", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "failed" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.status).toBe("failed");
    });

    it("should reject invalid status", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "processing" as any,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("date field", () => {
    it("should accept valid ISO datetime", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.date).toBe("2024-01-15T10:30:00.000Z");
    });

    it("should reject invalid datetime format", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject non-ISO datetime", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "01/15/2024 10:30 AM",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("method field", () => {
    it("should accept 'cash' method", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "cash" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.method).toBe("cash");
    });

    it("should accept 'bank_transfer' method", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.method).toBe("bank_transfer");
    });

    it("should accept 'credit_card' method", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "credit_card" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.method).toBe("credit_card");
    });

    it("should accept 'cheque' method", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "cheque" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.method).toBe("cheque");
    });

    it("should reject invalid payment method", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "paypal" as any,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("projectId field", () => {
    it("should accept valid UUID", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result.projectId).toBe("550e8400-e29b-41d4-a716-446655440000");
    });

    it("should reject invalid UUID", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
        projectId: "not-a-uuid",
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });

    it("should reject missing projectId", () => {
      const data = {
        description: "First milestone payment",
        amount: 5000,
        status: "pending" as const,
        date: "2024-01-15T10:30:00.000Z",
        method: "bank_transfer" as const,
      };
      expect(() => paymentSchema.parse(data)).toThrow(ZodError);
    });
  });

  describe("full valid payment object", () => {
    it("should parse complete payment data", () => {
      const data: PaymentInput = {
        description: "Q1 2024 Retainer Payment",
        amount: 15000.5,
        status: "completed",
        date: "2024-01-31T15:45:30.000Z",
        method: "bank_transfer",
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      };
      const result = paymentSchema.parse(data);
      expect(result).toEqual(data);
    });
  });
});

describe("updatePaymentSchema", () => {
  it("should allow partial updates with only description", () => {
    const data: UpdatePaymentInput = {
      description: "Updated payment description",
    };
    const result = updatePaymentSchema.parse(data);
    expect(result.description).toBe("Updated payment description");
  });

  it("should allow partial updates with only status", () => {
    const data: UpdatePaymentInput = {
      status: "completed",
    };
    const result = updatePaymentSchema.parse(data);
    expect(result.status).toBe("completed");
  });

  it("should allow empty update object", () => {
    const data: UpdatePaymentInput = {};
    const result = updatePaymentSchema.parse(data);
    expect(result).toEqual({});
  });

  it("should validate fields when provided", () => {
    const data = {
      projectId: "not-a-uuid",
    };
    expect(() => updatePaymentSchema.parse(data)).toThrow(ZodError);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdatePaymentInput = {
      status: "failed",
      description: "Payment failed - insufficient funds",
    };
    const result = updatePaymentSchema.parse(data);
    expect(result).toEqual(data);
  });

  it("should validate amount in updates", () => {
    const data = {
      amount: 0,
    };
    expect(() => updatePaymentSchema.parse(data)).toThrow(ZodError);
  });
});
