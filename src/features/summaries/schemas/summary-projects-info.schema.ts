import { z } from "zod";

export const summaryProjectInfoSchema = z.object({
  businessUnit: z.string().default(""),
  country: z.string().default(""),
  year: z.number().int().default(0),
  tasksInfo: z.string().default(""),
  status: z.string().default(""),
  budgetTotal: z.string().default(""),
  project: z.string().default(""),
});

export type SummaryProjectInfo = z.infer<typeof summaryProjectInfoSchema>;

export const summaryProjectsInfoSchema = z.array(summaryProjectInfoSchema);

export type SummaryProjectsInfo = z.infer<typeof summaryProjectsInfoSchema>;
