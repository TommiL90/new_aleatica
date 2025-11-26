"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";
import { valueFormat } from "@/lib/format";

type BarChartData = {
  name: string;
  fullName: string;
  value: number | undefined;
};

interface BudgetBarChartProps {
  data: BarChartData[];
}

const chartConfig = {
  value: {
    label: "Presupuesto",
  },
} satisfies ChartConfig;

export function BudgetBarChart({ data }: BudgetBarChartProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
      <CardHeader className="border-none pb-6">
        <CardTitle>Distribución de Presupuesto</CardTitle>
        <CardDescription>Monto total por Unidad de Negocio</CardDescription>
      </CardHeader>
      <CardContent className="h-80 pt-0">
        <ChartContainer config={chartConfig} className="h-full w-full pl-0">
          <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  hideIndicator
                  formatter={(value) => `$${valueFormat(Number(value))}`}
                />
              }
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((item) => (
                <Cell
                  key={item.fullName}
                  fill={
                    (item.value ?? 0) >= 0
                      ? "var(--chart-approved)"
                      : "var(--chart-rejected)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
