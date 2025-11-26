"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { valueFormat } from "@/lib/format";

type BarChartData = {
  name: string;
  fullName: string;
  value: number | undefined;
};

interface BudgetBarChartProps {
  data: BarChartData[];
}

export function BudgetBarChart({ data }: BudgetBarChartProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
      <CardHeader className="border-none pb-6">
        <CardTitle>Distribución de Presupuesto</CardTitle>
        <CardDescription>Monto total por Unidad de Negocio</CardDescription>
      </CardHeader>
      <CardContent className="h-80 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
  );
}
