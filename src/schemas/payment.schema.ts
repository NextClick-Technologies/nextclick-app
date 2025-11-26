import { z } from "zod";

export const paymentSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  status: z.enum(["pending", "completed", "failed"]),
  date: z.iso.datetime(),
  method: z.enum(["cash", "bank_transfer", "credit_card", "cheque"]),
  projectId: z.uuid("Project ID is required"),
});

export const updatePaymentSchema = paymentSchema.partial();

export type PaymentInput = z.infer<typeof paymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
