"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import * as React from "react";
import {
  Controller,
  type FieldPath,
  type Resolver,
  type SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from "@/components/ui/faceted";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { createBusinessUnit } from "../actions/create-business-unit";
import { updateBusinessUnit } from "../actions/update-business-unit";
import type {
  BusinessUnitPayload,
  BusinessUnitResult,
} from "../schemas/business-units";
import {
  businessUnitFormSchema,
  csvNumericSchema,
  integerNumber,
  nonNegativeNumber,
} from "../schemas/business-units";

// Extended schema to include UI-only fields and specific validations
const extendedBusinessUnitFormSchema = businessUnitFormSchema.extend({
  // UI-only calculated fields
  kmCarrilTotales: z.number().optional(),
  m2PavimentoTotales: z.number().optional(),
  // Ratio validation: max 2 decimals
  ratioOneYearsBefore: z
    .number()
    .optional()
    .default(0)
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Máximo 2 decimales",
    }),
  ratioTwoYearsBefore: z
    .number()
    .optional()
    .default(0)
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Máximo 2 decimales",
    }),
  ratiotTreeYearsBefore: z
    .number()
    .optional()
    .default(0)
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Máximo 2 decimales",
    }),
});

type BusinessUnitFormValues = z.infer<typeof extendedBusinessUnitFormSchema>;

interface BusinessUnitEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessUnit?: BusinessUnitResult | null;
}

type BusinessUnitFieldPath = FieldPath<BusinessUnitFormValues>;

const trafficFields: { name: BusinessUnitFieldPath; label: string }[] = [
  { name: "aadt", label: "TDPA" },
  { name: "aadht", label: "TDPA pesados" },
];

const ratioFields: { name: BusinessUnitFieldPath; label: string }[] = [
  { name: "ratioOneYearsBefore", label: "Ratio 1 año antes" },
  { name: "ratioTwoYearsBefore", label: "Ratio 2 años antes" },
  { name: "ratiotTreeYearsBefore", label: "Ratio 3 años antes" },
];

type BusinessUnitWithRelations = BusinessUnitResult & {
  mtBusinessUnitMtGeographicalAreas?: Array<{
    mtGeographicalAreaId: number;
  }>;
};

// Placeholder data for dropdowns
const geographicalAreasOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `Zona Geográfica ${i + 1}`,
  value: String(i + 1),
}));

// Placeholder data for administrations with countryId for filtering
const administrationsOptions = Array.from({ length: 20 }, (_, i) => ({
  label: `Administración ${i + 1}`,
  value: String(i + 1),
  // Assign countryId 1 to first 10, countryId 2 to next 10, etc.
  countryId: i < 10 ? 1 : 2,
}));

const parseDate = (value?: string | null) =>
  value ? (value.split("T")[0] ?? "") : "";

const getDefaultValues = (
  businessUnit?: BusinessUnitResult | null,
): BusinessUnitFormValues => {
  const withRelations = businessUnit as BusinessUnitWithRelations | undefined;

  const kmTrunkLane = businessUnit?.kmTrunkLane ?? 0;
  const branchLaneKm = businessUnit?.branchLaneKm ?? 0;
  const m2TrunkPavement = businessUnit?.m2TrunkPavement ?? 0;
  const m2PavementBranches = businessUnit?.m2PavementBranches ?? 0;

  return {
    id: businessUnit?.id,
    code: businessUnit?.code ?? "",
    name: businessUnit?.name ?? "",
    highDate: parseDate(businessUnit?.highDate),
    lowDate: parseDate(businessUnit?.lowDate),
    state: businessUnit?.state ?? true,
    mtCountryId: businessUnit?.mtCountryId ?? 0,
    kmTrunkRoad: businessUnit?.kmTrunkRoad ?? 0,
    kmTrunkLane,
    kmBranches: businessUnit?.kmBranches ?? 0,
    branchLaneKm,
    m2TrunkPavement,
    m2PavementBranches,
    noStructure: businessUnit?.noStructure ?? 0,
    m2Structure: businessUnit?.m2Structure ?? 0,
    aadt: businessUnit?.aadt ?? 0,
    aadht: businessUnit?.aadht ?? 0,
    ratioOneYearsBefore: businessUnit?.ratioOneYearsBefore ?? 0,
    ratioTwoYearsBefore: businessUnit?.ratioTwoYearsBefore ?? 0,
    ratiotTreeYearsBefore: businessUnit?.ratiotTreeYearsBefore ?? 0,
    geographicalAreas:
      withRelations?.mtBusinessUnitMtGeographicalAreas
        ?.map((item) => item.mtGeographicalAreaId)
        .join(",") ?? "",
    administrations:
      businessUnit?.mtBusinessUnitMtAdministrations
        ?.map((item) => item.mtAdministrationId)
        .join(",") ?? "",
    // Initialize calculated fields
    kmCarrilTotales: kmTrunkLane + branchLaneKm,
    m2PavimentoTotales: m2TrunkPavement + m2PavementBranches,
  };
};

const mapValuesToPayload = (
  values: BusinessUnitFormValues,
): BusinessUnitPayload => ({
  id: values.id ?? 0,
  code: values.code,
  name: values.name,
  highDate: values.highDate,
  lowDate: values.lowDate,
  modificationDate: values.lowDate,
  state: values.state,
  mtCountryId: values.mtCountryId,
  kmTrunkRoad: values.kmTrunkRoad,
  kmTrunkLane: values.kmTrunkLane,
  kmBranches: values.kmBranches,
  branchLaneKm: values.branchLaneKm,
  m2TrunkPavement: values.m2TrunkPavement,
  m2PavementBranches: values.m2PavementBranches,
  noStructure: values.noStructure,
  m2Structure: values.m2Structure,
  aadt: values.aadt,
  aadht: values.aadht,
  ratioOneYearsBefore: values.ratioOneYearsBefore ?? 0,
  ratioTwoYearsBefore: values.ratioTwoYearsBefore ?? 0,
  ratiotTreeYearsBefore: values.ratiotTreeYearsBefore ?? 0,
  mtGeographicalAreas: values.geographicalAreas
    ? values.geographicalAreas.split(",").map(Number)
    : [],
  mtAdministrations: values.administrations
    ? values.administrations.split(",").map(Number)
    : [],
  disabled: false,
});

export function BusinessUnitEditDialog({
  open,
  onOpenChange,
  businessUnit,
}: BusinessUnitEditDialogProps) {
  const defaultValues = React.useMemo(
    () => getDefaultValues(businessUnit),
    [businessUnit],
  );

  const form = useForm<BusinessUnitFormValues>({
    // Cast to Resolver<BusinessUnitFormValues> to ensure type compatibility
    resolver: zodResolver(
      extendedBusinessUnitFormSchema,
    ) as unknown as Resolver<BusinessUnitFormValues>,
    defaultValues,
  });

  // Watch fields for real-time calculations and filtering
  const kmTrunkLane = useWatch({ control: form.control, name: "kmTrunkLane" });
  const branchLaneKm = useWatch({
    control: form.control,
    name: "branchLaneKm",
  });
  const m2TrunkPavement = useWatch({
    control: form.control,
    name: "m2TrunkPavement",
  });
  const m2PavementBranches = useWatch({
    control: form.control,
    name: "m2PavementBranches",
  });
  const mtCountryId = useWatch({ control: form.control, name: "mtCountryId" });

  // Update calculated fields
  React.useEffect(() => {
    const totalKm = (Number(kmTrunkLane) || 0) + (Number(branchLaneKm) || 0);
    form.setValue("kmCarrilTotales", totalKm);
  }, [kmTrunkLane, branchLaneKm, form]);

  React.useEffect(() => {
    const totalM2 =
      (Number(m2TrunkPavement) || 0) + (Number(m2PavementBranches) || 0);
    form.setValue("m2PavimentoTotales", totalM2);
  }, [m2TrunkPavement, m2PavementBranches, form]);

  // Clear administrations if country changes (optional, but good UX)
  // React.useEffect(() => {
  //   form.setValue("administrations", "");
  // }, [mtCountryId, form]);

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  React.useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  const [isPending, startTransition] = React.useTransition();

  const handleSubmit: SubmitHandler<BusinessUnitFormValues> = (values) => {
    startTransition(async () => {
      const payload = mapValuesToPayload(values);
      const isUpdate = payload.id > 0;

      const result = isUpdate
        ? await updateBusinessUnit(payload.id, payload)
        : await createBusinessUnit(payload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isUpdate
          ? "Unidad de negocio actualizada correctamente"
          : "Unidad de negocio creada correctamente",
      );
      onOpenChange(false);
    });
  };

  const renderInputField = (
    name: BusinessUnitFieldPath,
    label: string,
    options?: {
      type?: React.HTMLInputTypeAttribute;
      placeholder?: string;
      step?: string;
      disabled?: boolean;
    },
  ) => (
    <Controller
      key={name}
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const fieldId = `business-unit-${String(name).replace(/\./g, "-")}`;
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
            <Input
              id={fieldId}
              type={options?.type ?? "text"}
              placeholder={options?.placeholder}
              step={options?.step}
              disabled={options?.disabled}
              {...field}
              value={
                typeof field.value === "boolean"
                  ? ""
                  : (field.value?.toString() ?? "")
              }
              onChange={(event) => field.onChange(event.target.value)}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );

  const renderNumberField = (
    name: BusinessUnitFieldPath,
    label: string,
    step = "0.01",
    disabled = false,
  ) => renderInputField(name, label, { type: "number", step, disabled });

  // Filtered options based on country
  const filteredAdministrationsOptions = React.useMemo(() => {
    if (!mtCountryId) return [];
    return administrationsOptions.filter(
      (opt) => opt.countryId === Number(mtCountryId),
    );
  }, [mtCountryId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">

      </DialogContent>
    </Dialog>
  );
}
