import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  orderBy: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
