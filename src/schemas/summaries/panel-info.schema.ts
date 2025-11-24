import { z } from "zod";
import { createApiResponseSchema } from "../common/api-response.schema";

/**
 * ⭐ Schema Zod = Entity
 *
 * Este schema define la estructura, validación y valores por defecto.
 * El tipo inferido es tu Entity Type.
 */

// Schema para ProjectTasksInfo
export const projectTasksInfoSchema = z.object({
  // ⚠️ CRÍTICOS: Sin defaults - Si faltan, debe fallar
  projectTask: z.string().min(1), // Se renderiza en UI
  status: z.string().min(1), // Se renderiza en UI
  description: z.string(), // Se renderiza en UI (puede estar vacío)
});

export type ProjectTasksInfo = z.infer<typeof projectTasksInfoSchema>;

// Schema para ProjectsInfo
export const projectsInfoSchema = z.object({
  // ⚠️ CRÍTICOS: Sin defaults - Si faltan, debe fallar
  project: z.string().min(1), // Se renderiza en UI
  businessUnit: z.string().min(1), // Se renderiza en UI
  projectId: z.number().int().positive(), // Necesario para keys y navegación

  // ✅ OPCIONALES: Con defaults - Si faltan, no rompe
  projectTasksInfo: z.array(projectTasksInfoSchema).default([]),
  manualPerformanceCatalogCount: z.number().int().nonnegative().default(0),
  performanceCatalogCount: z.number().int().nonnegative().default(0),
  deferredPerformanceCatalogCount: z.number().int().nonnegative().default(0),
});

export type ProjectsInfo = z.infer<typeof projectsInfoSchema>;

// Schema para el contenido del result (PanelInfo)
export const panelInfoSchema = z.object({
  // ⚠️ CRÍTICOS: Sin defaults - Si faltan, debe fallar
  projectsInfo: z.array(projectsInfoSchema).min(0), // Array puede estar vacío pero debe existir

  // ✅ OPCIONALES: Con defaults - Si faltan, no rompe
  compositeCatalogCount: z.number().int().nonnegative().default(0),
  simpleCatalogCount: z.number().int().nonnegative().default(0),
  deteriorationCatalogsCount: z.number().int().nonnegative().default(0),
});

export type PanelInfo = z.infer<typeof panelInfoSchema>;

// Schema para el wrapper de la respuesta de la API
// Usa el helper genérico que todas las APIs comparten
export const panelInfoApiResponseSchema =
  createApiResponseSchema(panelInfoSchema);

export type PanelInfoApiResponse = z.infer<typeof panelInfoApiResponseSchema>;
