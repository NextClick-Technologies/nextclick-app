import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Invalid email address"),
  address: z.string().min(3, "Address is required"),
  phoneNumber: z.string().min(9, "Phone number is required"),
  contactPerson: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  status: z.string().default("active"),
});

export const updateCompanySchema = companySchema.partial();

export type CompanyInput = z.input<typeof companySchema>;
export type CompanyOutput = z.output<typeof companySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
