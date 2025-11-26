import { z } from "zod";

export const summaryOpProjectInfoSchema = z.object({
  businessUnit: z.string().default(""),
  country: z.string().default(""),
  year: z.number().int().default(0),
  tasksInfo: z.string().default(""),
  status: z.string().default(""),
  budgetTotal: z.string().default(""),
  project: z.string().default(""),
});

export type SummaryOpProjectInfo = z.infer<typeof summaryOpProjectInfoSchema>;

export const summaryOpProjectsInfoSchema = z.array(summaryOpProjectInfoSchema);

export type SummaryOpProjectsInfo = z.infer<typeof summaryOpProjectsInfoSchema>;
