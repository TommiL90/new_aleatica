"use client";

import type * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { BusinessUnitResult } from "../schemas/business-units";

interface BusinessUnitDetailsDialogProps {
  businessUnit: BusinessUnitResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BusinessUnitDetailsDialog({
  businessUnit,
  open,
  onOpenChange,
}: BusinessUnitDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>{businessUnit.name}</DialogTitle>
          <DialogDescription>
            Unidad de Negocio - Código: {businessUnit.code}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <div className="space-y-4 pr-4">
            {/* Sección: Información General */}
            <Section title="Información General">
              <InfoGrid>
                <InfoItem label="Código" value={businessUnit.code} />
                <InfoItem label="País" value={businessUnit.mtCountry} />
                <InfoItem
                  label="Estado"
                  value={businessUnit.state ? "Activo" : "Inactivo"}
                />
              </InfoGrid>
            </Section>

            <Separator className="my-4" />

            {/* Sección: Administraciones */}
            {businessUnit.mtBusinessUnitMtAdministrations.length > 0 && (
              <>
                <Section title="Administraciones">
                  <BadgeList
                    items={businessUnit.mtBusinessUnitMtAdministrations}
                    labelKey="mtAdministration"
                    variant="green"
                  />
                </Section>

                <Separator className="my-4" />
              </>
            )}

            {/* Sección: Tramos */}
            {businessUnit.mtRoadSections.length > 0 && (
              <>
                <Section title="Tramos de Carretera">
                  <BadgeList
                    items={businessUnit.mtRoadSections}
                    labelKey="name"
                    variant="amber"
                  />
                </Section>

                <Separator className="my-4" />
              </>
            )}

            {/* Sección: Métricas de Carretera */}
            <Section title="Métricas de Carretera">
              <div className="space-y-6">
                <Subsection title="Kilómetros">
                  <InfoGrid columns={3}>
                    <InfoItem
                      label="Km troncal"
                      value={businessUnit.kmTrunkRoad}
                    />
                    <InfoItem
                      label="Km-carril troncal"
                      value={businessUnit.kmTrunkLane}
                    />
                    <InfoItem
                      label="Km ramales"
                      value={businessUnit.kmBranches}
                    />
                    <InfoItem
                      label="Km-carril ramales"
                      value={businessUnit.branchLaneKm}
                    />
                    <InfoItem
                      label="Km-carril totales"
                      value={businessUnit.kmTotalLane}
                    />
                  </InfoGrid>
                </Subsection>

                <Subsection title="Pavimento (M²)">
                  <InfoGrid columns={3}>
                    <InfoItem
                      label="M² pavimento troncal"
                      value={businessUnit.m2TrunkPavement}
                    />
                    <InfoItem
                      label="M² pavimento ramales"
                      value={businessUnit.m2PavementBranches}
                    />
                    <InfoItem
                      label="M² pavimento totales"
                      value={businessUnit.m2TotalPavement}
                    />
                  </InfoGrid>
                </Subsection>

                <Subsection title="Estructuras">
                  <InfoGrid columns={3}>
                    <InfoItem
                      label="Número de estructuras"
                      value={businessUnit.noStructure}
                    />
                    <InfoItem
                      label="M² Estructuras"
                      value={businessUnit.m2Structure}
                    />
                  </InfoGrid>
                </Subsection>

                <Subsection title="Tráfico">
                  <InfoGrid columns={3}>
                    <InfoItem label="TDPA" value={businessUnit.aadt} />
                    <InfoItem label="TDPA Pesados" value={businessUnit.aadht} />
                  </InfoGrid>
                </Subsection>

                <Subsection title="Ratios">
                  <InfoGrid columns={3}>
                    <InfoItem
                      label="Ratio 1 año antes"
                      value={formatNumber(businessUnit.ratioOneYearsBefore)}
                    />
                    <InfoItem
                      label="Ratio 2 años antes"
                      value={formatNumber(businessUnit.ratioTwoYearsBefore)}
                    />
                    <InfoItem
                      label="Ratio 3 años antes"
                      value={formatNumber(businessUnit.ratiotTreeYearsBefore)}
                    />
                  </InfoGrid>
                </Subsection>
              </div>
            </Section>

            <Separator className="my-4" />

            {/* Sección: Fechas */}
            <Section title="Fechas">
              <InfoGrid columns={2}>
                <InfoItem
                  label="Fecha Alta"
                  value={formatDate(businessUnit.highDate)}
                />
                <InfoItem
                  label="Fecha Baja"
                  value={formatDate(businessUnit.lowDate)}
                />
              </InfoGrid>
            </Section>

            <Separator className="my-4" />

            {/* Sección: Auditoría */}
            <Section title="Auditoría">
              <InfoGrid columns={2}>
                <InfoItem
                  label="Fecha de Modificación"
                  value={formatDate(businessUnit.modificationDate)}
                />
              </InfoGrid>
            </Section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ==================== Helper Components ====================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">{title}</h3>
      {children}
    </div>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-muted-foreground text-xs">{title}</h4>
      {children}
    </div>
  );
}

function InfoGrid({
  columns = 3,
  children,
}: {
  columns?: 2 | 3;
  children: React.ReactNode;
}) {
  const gridClass =
    columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3";

  return <div className={`grid gap-4 ${gridClass}`}>{children}</div>;
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="font-medium text-muted-foreground text-xs">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}

function BadgeList({
  items,
  labelKey,
  variant = "secondary",
}: {
  items: Array<Record<string, string | number>>;
  labelKey: "name" | "mtAdministration";
  variant?: "green" | "amber" | "secondary";
}) {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <Badge key={idx} variant={variant}>
          {item[labelKey]}
        </Badge>
      ))}
    </div>
  );
}

// ==================== Helper Functions ====================

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return dateString;
  }
}

function formatNumber(value: number): string {
  return value.toFixed(2);
}
