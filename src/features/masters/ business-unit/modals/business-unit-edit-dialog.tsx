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
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAdministrationOptions, getCountryOptions } from "@/actions/get-master-options";
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
import type { AdministrationOption, CountryOption } from "@/actions/get-master-options";

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

// Default empty options - will be populated from server actions
const defaultCountriesOptions: CountryOption[] = [];
const defaultAdministrationsOptions: AdministrationOption[] = [];

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
  // State for master data options
  const [countriesOptions, setCountriesOptions] = React.useState<CountryOption[]>(
    defaultCountriesOptions
  );
  const [administrationsOptions, setAdministrationsOptions] = React.useState<
    AdministrationOption[]
  >(defaultAdministrationsOptions);
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(false);

  // Load master data options on dialog open
  React.useEffect(() => {
    if (!open) return;

    async function loadMasterOptions() {
      setIsLoadingOptions(true);
      try {
        const [countriesResult, administrationsResult] = await Promise.all([
          getCountryOptions(),
          getAdministrationOptions(),
        ]);

        if (countriesResult.data) {
          setCountriesOptions(countriesResult.data);
        }
        if (administrationsResult.data) {
          setAdministrationsOptions(administrationsResult.data);
        }
      } catch (error) {
        console.error("Error loading master options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    }

    loadMasterOptions();
  }, [open]);

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
      <DialogContent className="!max-w-4xl flex h-[90vh] max-h-[90vh] flex-col">
        <DialogHeader className="border-b pb-4 shrink-0">
          <DialogTitle className="text-2xl">
            {businessUnit?.id ? "Editar Unidad de Negocio" : "Crear Unidad de Negocio"}
          </DialogTitle>
          <DialogDescription>
            {businessUnit?.id
              ? `Actualizando: ${businessUnit.code}`
              : "Complete los datos para crear una nueva unidad de negocio"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <form
            id="business-unit-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 px-6 py-4"
          >
            {/* Section A: Basic Information */}
            <FieldSet>
              <FieldLegend>Información Básica</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderInputField("code", "Código", {
                  placeholder: "BU-001",
                })}
                {renderInputField("name", "Nombre", {
                  placeholder: "Unidad Central",
                })}
                <Controller
                  name="mtCountryId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="country">País</FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value?.toString() ?? ""}
                        onValueChange={(value) =>
                          field.onChange(Number(value))
                        }
                      >
                        <SelectTrigger
                          id="country"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Seleccionar país..." />
                        </SelectTrigger>
                        <SelectContent>
                          {administrationsOptions && administrationsOptions.length > 0 && (
                            <>
                              {Array.from(
                                new Set(administrationsOptions.map((a) => a.countryId))
                              )
                                .map((countryId) => ({
                                  value: countryId,
                                  label: `País ${countryId}`,
                                }))
                                .map((country) => (
                                  <SelectItem
                                    key={country.value}
                                    value={country.value.toString()}
                                  >
                                    {country.label}
                                  </SelectItem>
                                ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {renderInputField("highDate", "Fecha Alta", {
                  type: "date",
                })}
                {renderInputField("lowDate", "Fecha Baja", {
                  type: "date",
                })}
                <Controller
                  name="state"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="state" className="font-normal">
                        Activo
                      </FieldLabel>
                      <Checkbox
                        id="state"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section B: Road Infrastructure */}
            <FieldSet>
              <FieldLegend>Infraestructura Vial - Troncales y Ramales</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderNumberField("kmTrunkRoad", "Km Troncal")}
                {renderNumberField("kmTrunkLane", "Km Carril Troncal")}
                {renderNumberField("kmBranches", "Km Ramales")}
                {renderNumberField("branchLaneKm", "Km Carril Ramales")}
                {renderNumberField(
                  "kmCarrilTotales",
                  "Km Carril Totales",
                  "0.01",
                  true
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section C: Pavement */}
            <FieldSet>
              <FieldLegend>Pavimentación</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderNumberField("m2TrunkPavement", "M² Pavimento Troncal")}
                {renderNumberField(
                  "m2PavementBranches",
                  "M² Pavimento Ramales"
                )}
                {renderNumberField(
                  "m2PavimentoTotales",
                  "M² Pavimento Totales",
                  "0.01",
                  true
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section D: Structures */}
            <FieldSet>
              <FieldLegend>Estructuras</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberField("noStructure", "Número de Estructuras", "1")}
                {renderNumberField("m2Structure", "M² Estructuras")}
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section E: Traffic */}
            <FieldSet>
              <FieldLegend>Tráfico</FieldLegend>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderNumberField("aadt", "TDPA (Tráfico Promedio Diario)", "1")}
                {renderNumberField("aadht", "TDPA Pesados", "1")}
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section F: Historical Ratios */}
            <FieldSet>
              <FieldLegend>Datos Históricos - Ratios</FieldLegend>
              <FieldDescription>
                Valores opcionales con máximo 2 decimales
              </FieldDescription>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderNumberField("ratioOneYearsBefore", "Ratio 1 año antes", "0.01")}
                {renderNumberField("ratioTwoYearsBefore", "Ratio 2 años antes", "0.01")}
                {renderNumberField(
                  "ratiotTreeYearsBefore",
                  "Ratio 3 años antes",
                  "0.01"
                )}
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            {/* Section G: Relations */}
            <FieldSet>
              <FieldLegend>Relaciones</FieldLegend>
              <FieldDescription>
                Selecciona las administraciones asociadas a esta unidad
              </FieldDescription>
              <Controller
                name="administrations"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Administraciones</FieldLabel>
                    <div className="space-y-3">
                      <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                        {filteredAdministrationsOptions.length > 0 ? (
                          <FieldGroup data-slot="checkbox-group" className="gap-2">
                            {filteredAdministrationsOptions.map((option) => (
                              <Field
                                key={option.value}
                                orientation="horizontal"
                                data-invalid={fieldState.invalid}
                              >
                                <Checkbox
                                  id={`admin-${option.value}`}
                                  checked={field.value
                                    .split(",")
                                    .filter(Boolean)
                                    .includes(option.value.toString())}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value
                                      .split(",")
                                      .filter(Boolean)
                                      .map(String);
                                    const updated = checked
                                      ? [...currentValues, option.value.toString()]
                                      : currentValues.filter(
                                          (v) => v !== option.value.toString()
                                        );
                                    field.onChange(updated.join(","));
                                  }}
                                  aria-invalid={fieldState.invalid}
                                />
                                <FieldLabel
                                  htmlFor={`admin-${option.value}`}
                                  className="font-normal"
                                >
                                  {option.label}
                                </FieldLabel>
                              </Field>
                            ))}
                          </FieldGroup>
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            Selecciona un país para ver las administraciones disponibles
                          </p>
                        )}
                      </div>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
          </form>
        </ScrollArea>

        <DialogFooter className="border-t pt-4 px-6 pb-4 shrink-0 flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" form="business-unit-form" disabled={isPending}>
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
