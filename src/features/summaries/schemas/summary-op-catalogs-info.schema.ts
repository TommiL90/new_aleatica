import { z } from "zod";

export const summaryOpCatalogsInfoSchema = z.object({
  simpleCatalogCount: z.number().int().nonnegative().default(0),
  compositeCatalogCount: z.number().int().nonnegative().default(0),
  materialsCatalogCount: z.number().int().nonnegative().default(0),
  compositeWorkCount: z.number().int().nonnegative().default(0),
});

export type SummaryOpCatalogsInfo = z.infer<typeof summaryOpCatalogsInfoSchema>;
