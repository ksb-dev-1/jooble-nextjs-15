import * as z from "zod";

export const jobFilterSchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  location: z.string().optional(),
  workMode: z.string().optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
});

export type JobFilterValues = z.infer<typeof jobFilterSchema>;
