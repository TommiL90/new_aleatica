"use client";
import { Briefcase, Hammer, Layers, Package, TrendingUp } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { H2 } from "@/components/typography/h2";
import { P } from "@/components/typography/p";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { dictionaryNames } from "@/constants/dictionary";
import { valueFormat } from "@/lib/format";
import type { Data1, Tipo2 } from "../types";
import {
  normalizeStatusKey,
  STATUS_DICTIONARY_MAP,
  translateStatusLabel,
} from "../utils/status-label";

interface DashboardProps {
  kpis: Data1;
  budgets: Tipo2;
}

type PieEntry = {
  name: string;
  statusKey: string;
  value: number;
  fill: string;
};

const chartConfig = {
  created: {
    label: dictionaryNames.created,
    color: "var(--chart-created)",
  },
  approved: {
    label: dictionaryNames.approved,
    color: "var(--chart-approved)",
  },
  rejected: {
    label: dictionaryNames.rejected,
    color: "var(--chart-rejected)",
  },
  inReview: {
    label: dictionaryNames.inReview,
    color: "var(--chart-inReview)",
  },
  closed: {
    label: dictionaryNames.closed,
    color: "var(--chart-closed)",
  },
} satisfies ChartConfig;

export const Dashboard: React.FC<DashboardProps> = ({ kpis, budgets }) => {
  // Calculate aggregate data for charts
  const chartData = useMemo(() => {
    // Group by Business Unit for Bar Chart
    const byBU: Record<string, number> = {};
    budgets.forEach((b) => {
      const val = parseFloat(b.budgetTotal);
      // Using absolute value for visualization magnitude
      const safeVal = Math.abs(val);
      byBU[b.businessUnit] = (byBU[b.businessUnit] || 0) + safeVal;
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

    const pieData: PieEntry[] = Object.keys(byStatus).map((status) => {
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
        <P className="text-slate-500">
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
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader className="border-none pb-6">
            <CardTitle> Distribución de Presupuesto</CardTitle>
            <CardDescription>
              {" "}
              Monto total por Unidad de Negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 pt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [
                    `$${valueFormat(value)}`,
                    "Presupuesto",
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Pie Chart */}
        <Card className="flex flex-col border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-none pb-6">
            <CardTitle> Estado de Proyectos</CardTitle>
            <CardDescription>Desglose por estatus actual</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData.pieData}
                  dataKey="value"
                  nameKey="statusKey"
                  innerRadius={60}
                  fill="fill"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
