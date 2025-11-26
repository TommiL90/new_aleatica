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

export type ArrayBusinessUnitResult = z.infer<
  typeof arrayBusinessUnitResultSchema
>;

export const nonNegativeNumber = (label: string) =>
  z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: `${label} es requerido`,
    })
    .refine((value) => value >= 0, {
      message: `${label} debe ser mayor o igual a 0`,
    });

export const integerNumber = (label: string) =>
  nonNegativeNumber(label).refine((value) => Number.isInteger(value), {
    message: `${label} debe ser un número entero`,
  });

export const csvNumericSchema = z
  .string()
  .optional()
  .default("")
  .refine(
    (value) =>
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .every((entry) => /^\d+$/.test(entry)),
    {
      message: "Solo se permiten IDs numéricos separados por comas",
    },
  );

export const businessUnitFormSchema = z.object({
  id: z.number().int().optional(),
  code: z.string().min(1, "El código es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  highDate: z.string().min(1, "La fecha de alta es obligatoria"),
  lowDate: z.string().min(1, "La fecha de baja es obligatoria"),
  state: z.boolean(),
  mtCountryId: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value) && value > 0, {
      message: "Selecciona un país",
    }),
  kmTrunkRoad: nonNegativeNumber("Km troncal"),
  kmTrunkLane: nonNegativeNumber("Km carril troncal"),
  kmBranches: nonNegativeNumber("Km ramales"),
  branchLaneKm: nonNegativeNumber("Km carril ramales"),
  m2TrunkPavement: nonNegativeNumber("M² pavimento troncal"),
  m2PavementBranches: nonNegativeNumber("M² pavimento ramales"),
  noStructure: integerNumber("Número de estructuras"),
  m2Structure: nonNegativeNumber("M² de estructuras"),
  aadt: integerNumber("TDPA"),
  aadht: integerNumber("TDPA pesados"),
  ratioOneYearsBefore: nonNegativeNumber("Ratio 1 año antes")
    .optional()
    .default(0),
  ratioTwoYearsBefore: nonNegativeNumber("Ratio 2 años antes")
    .optional()
    .default(0),
  ratiotTreeYearsBefore: nonNegativeNumber("Ratio 3 años antes")
    .optional()
    .default(0),
  administrations: csvNumericSchema,
});

export type BusinessUnitFormValues = z.infer<typeof businessUnitFormSchema>;

export interface BusinessUnitPayload {
  id: number;
  disabled: boolean;
  name: string;
  code: string;
  highDate: string;
  lowDate: string;
  modificationDate: string;
  state: boolean;
  mtCountryId: number;
  kmTrunkRoad: number;
  kmTrunkLane: number;
  kmBranches: number;
  branchLaneKm: number;
  m2TrunkPavement: number;
  m2PavementBranches: number;
  noStructure: number;
  m2Structure: number;
  aadt: number;
  aadht: number;
  mtAdministrations: number[];
  ratioOneYearsBefore?: number;
  ratioTwoYearsBefore?: number;
  ratiotTreeYearsBefore?: number;
}
