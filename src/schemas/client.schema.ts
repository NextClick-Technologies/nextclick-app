import { z } from "zod";
import { Title, Gender, ClientStatus } from "@/types";

export const clientSchema = z.object({
  title: z.enum(Title).default(Title.MR),
  gender: z.enum(Gender).default(Gender.OTHER),
  name: z.string().min(2, "First Name must be at least 2 characters"),
  familyName: z.string().min(2, "Family Name must be at least 2 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.email("Invalid email address").optional().or(z.literal("")),
  totalContractValue: z.number().default(0),
  joinDate: z.string().optional().nullable(),
  companyId: z
    .string()
    .min(1, "Please select a company")
    .uuid("Please select a valid company"),
  status: z.enum(ClientStatus).default(ClientStatus.ACTIVE),
});

export const updateClientSchema = clientSchema.partial();

export type ClientInput = z.input<typeof clientSchema>;
export type UpdateClientInput = z.input<typeof updateClientSchema>;
