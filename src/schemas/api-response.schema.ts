import { z } from "zod";

/**
 * Schema genérico para el wrapper de respuesta de la API
 *
 * Todas las llamadas HTTP retornan esta estructura:
 * {
 *   status: number,
 *   result: T,  // ⭐ La diferencia está aquí - el tipo de T varía
 *   errorMessage: string | null,
 *   exceutionTime: string
 * }
 *
 * @param resultSchema - Schema Zod para el contenido de `result`
 * @returns Schema Zod para el wrapper completo de la respuesta API
 *
 * @example
 * ```typescript
 * const panelInfoApiResponseSchema = createApiResponseSchema(panelInfoSchema);
 * const parsed = panelInfoApiResponseSchema.safeParse(apiResponse);
 * const panelInfo = parsed.data.result; // PanelInfo validado
 * ```
 */

// biome-ignore lint/suspicious/noExplicitAny: <>
export  function createApiResponseSchema<T extends z.ZodType<any>>(resultSchema: T) {
  return z.object({
    status: z.number().int(),
    result: resultSchema, // ⭐ El contenido real está en result
    errorMessage: z.string().nullable().default(null),
    exceutionTime: z.string().optional(), // Typo en la API: "exceutionTime" en lugar de "executionTime"
  });
}

/**
 * Tipo helper para inferir el tipo de la respuesta API
 */
export type ApiResponseWrapper<T> = {
  status: number;
  result: T;
  errorMessage: string | null;
  exceutionTime?: string;
};
