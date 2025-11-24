import { z } from "zod";

// biome-ignore lint/suspicious/noExplicitAny: <>
export function PaginatedResponseSchema<T extends z.ZodType<any>>(
  resultSchema: T,
) {
  return z.object({
    currentPage: z.number().int(),
    pageCount: z.number().int(),
    pageSize: z.number().int(),
    recordCount: z.number().int(),
    results: resultSchema, // API devuelve "results" (plural)
  });
}

/**
 * Tipo helper para la respuesta paginada
 */
export type PaginatedResponse<T> = {
  currentPage: number;
  pageCount: number;
  pageSize: number;
  recordCount: number;
  results: T; // API devuelve "results" (plural)
};
