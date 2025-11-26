"use client";
import { Briefcase, Hammer, Layers, Package } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { H2 } from "@/components/typography/h2";
import { P } from "@/components/typography/p";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Data1, Tipo2 } from "../types";
import {
  normalizeStatusKey,
  STATUS_DICTIONARY_MAP,
  translateStatusLabel,
} from "../utils/status-label";
import { BudgetBarChart } from "./budget-bar-chart";
import { ProjectStatusPieChart } from "./dashboard-pie-chart";

interface DashboardProps {
  kpis: Data1;
  budgets: Tipo2;
}

export const Dashboard: React.FC<DashboardProps> = ({ kpis, budgets }) => {
  // Calculate aggregate data for charts
  const chartData = useMemo(() => {
    // Group by Business Unit for Bar Chart
    const byBU: Record<string, number> = {};
    budgets.forEach((b) => {
      const val = parseFloat(b.budgetTotal) || 0;
      byBU[b.businessUnit] = (byBU[b.businessUnit] || 0) + val;
    });

    const barData = Object.keys(byBU).map((bu) => ({
      name: bu.split("(")[1]?.replace(")", "") || bu.substring(0, 10), // Short name for axis
      fullName: bu,
      value: byBU[bu],
    }));

    // Group by Status for Pie Chart
    const byStatus: Record<string, number> = {};
    budgets.forEach((b) => {
      byStatus[b.status] = (byStatus[b.status] || 0) + 1;
    });

    const pieData = Object.keys(byStatus).map((status) => {
      const normalized = normalizeStatusKey(status);
      // Map to chart key using STATUS_DICTIONARY_MAP
      const chartKey =
        STATUS_DICTIONARY_MAP[
          normalized as keyof typeof STATUS_DICTIONARY_MAP
        ] || normalized;
      return {
        name: translateStatusLabel(status),
        statusKey: chartKey,
        value: byStatus[status],
        fill: `var(--color-${chartKey})`,
      };
    });

    return { barData, pieData };
  }, [budgets]);

  const kpiCards = [
    {
      label: "Catálogos Simples",
      value: kpis.simpleCatalogCount,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Catálogos Compuestos",
      value: kpis.compositeCatalogCount,
      icon: Layers,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Catálogo de Materiales",
      value: kpis.materialsCatalogCount,
      icon: Hammer,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Obras Compuestas",
      value: kpis.compositeWorkCount,
      icon: Briefcase,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <>
      <div className="mb-6">
        <H2>Resumen Ejecutivo</H2>
        <P className="text-muted-foreground">
          Vista general de métricas clave y estado de proyectos.
        </P>
      </div>

      {/* KPI Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, idx) => (
          <Card
            key={idx}
            className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="border-none pb-0">
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-3 ${kpi.bg}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-1 font-medium text-slate-400 text-xs">
                  Actualizado
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <h3 className="mb-1 font-bold text-3xl text-slate-900">
                {kpi.value.toLocaleString()}
              </h3>
              <p className="font-medium text-slate-500 text-sm">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Bar Chart */}
        <BudgetBarChart data={chartData.barData} />

        {/* Status Pie Chart */}
        <ProjectStatusPieChart data={chartData.pieData} />
      </div>
    </>
  );
};
