"use client";

import { Pie, PieChart } from "recharts";
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
import { dictionaryNames } from "@/constants/dictionary";
import { STATUS_DICTIONARY_MAP } from "../utils/status-label";

type PieEntry = {
  name: string;
  statusKey: string;
  value: number | undefined;
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

interface ProjectStatusPieChartProps {
  data: PieEntry[];
}

export function ProjectStatusPieChart({ data }: ProjectStatusPieChartProps) {
  return (
    <Card className="flex flex-col border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-none pb-6">
        <CardTitle>Estado de Proyectos</CardTitle>
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
              data={data}
              dataKey="value"
              nameKey="statusKey"
              innerRadius={60}
              fill="fill"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
