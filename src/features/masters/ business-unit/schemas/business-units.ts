import { z } from "zod";

/**
 * Schema para MtBusinessUnitMtAdministration
 */
export const mtBusinessUnitMtAdministrationSchema = z.object({
  mtBusinessUnit: z.string(),
  mtAdministration: z.string(),
  mtBusinessUnitId: z.number().int(),
  mtAdministrationId: z.number().int(),
  id: z.number().int(),
  disabled: z.boolean(),
});

export type MtBusinessUnitMtAdministration = z.infer<
  typeof mtBusinessUnitMtAdministrationSchema
>;

/**
 * Schema para MtRoadSection
 */
export const mtRoadSectionSchema = z.object({
  mtBusinessUnit: z.string(),
  mtRoadSectionMtHighwayIntersections: z.array(z.any()),
  highDate: z.string(),
  lowDate: z.string(),
  modificationDate: z.string(),
  state: z.boolean(),
  mtBusinessUnitId: z.number().int(),
  code: z.string(),
  name: z.string(),
  id: z.number().int(),
  disabled: z.boolean(),
});

export type MtRoadSection = z.infer<typeof mtRoadSectionSchema>;

/**
 * Schema para el resultado de Business Unit (Unidad de Negocio)
 */
export const businessUnitResultSchema = z.object({
  mtCountry: z.string(),
  mtBusinessUnitMtAdministrations: z.array(
    mtBusinessUnitMtAdministrationSchema,
  ),
  mtRoadSections: z.array(mtRoadSectionSchema),
  highDate: z.string(),
  lowDate: z.string(),
  modificationDate: z.string(),
  state: z.boolean(),
  mtCountryId: z.number().int(),
  kmTrunkRoad: z.number(),
  kmTrunkLane: z.number(),
  kmBranches: z.number(),
  branchLaneKm: z.number(),
  kmTotalLane: z.number(),
  m2TrunkPavement: z.number(),
  m2PavementBranches: z.number(),
  m2TotalPavement: z.number(),
  noStructure: z.number().int(),
  m2Structure: z.number(),
  aadt: z.number().int(),
  aadht: z.number().int(),
  ratioOneYearsBefore: z.number(),
  ratioTwoYearsBefore: z.number(),
  ratiotTreeYearsBefore: z.number(),
  mtAdministrations: z.array(z.any()),
  code: z.string(),
  name: z.string(),
  id: z.number().int(),
  disabled: z.boolean(),
});

export type BusinessUnitResult = z.infer<typeof businessUnitResultSchema>;

export const arrayBusinessUnitResultSchema = z.array(businessUnitResultSchema);

export type ArrayBusinessUnitResult = z.infer<typeof arrayBusinessUnitResultSchema>;
