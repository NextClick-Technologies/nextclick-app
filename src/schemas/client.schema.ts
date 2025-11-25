import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.enum(["mr", "mrs", "ms", "dr", "prof", "sr"]).optional().nullable(),
  familyName: z.string().min(1, "Family name is required"),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

export const updateClientSchema = clientSchema.partial();

export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
