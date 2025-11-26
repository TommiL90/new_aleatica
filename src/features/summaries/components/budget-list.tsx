"use client";
import { Download, Filter, Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { H2 } from "@/components/typography/h2";
import { P } from "@/components/typography/p";
import { useClientDataTable } from "@/hooks/use-client-data-table";
import type { BudgetProject } from "../types";
import { budgetColumns } from "./columns/budget-columns";

interface BudgetListProps {
  data: BudgetProject[];
  title: string;
}

export const BudgetList: React.FC<BudgetListProps> = ({ data, title }) => {
  const [filter, setFilter] = useState("");

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          item.project.toLowerCase().includes(filter.toLowerCase()) ||
          item.businessUnit.toLowerCase().includes(filter.toLowerCase()),
      ),
    [data, filter],
  );

  const { table } = useClientDataTable({
    columns: budgetColumns,
    data: filteredData,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <H2>{title}</H2>
          <P className="text-slate-500">
            Gestión detallada de partidas presupuestarias
          </P>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 text-sm shadow-sm transition-colors hover:bg-slate-50">
            <Filter size={16} className="mr-2" />
            Filtros
          </button>
          <button className="flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 font-medium text-sm text-white shadow-sm transition-colors hover:bg-slate-800">
            <Download size={16} className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <DataTable
        className="rounded-xl border border-slate-200 bg-white shadow-sm"
        table={table}
      >
        <div className="border-slate-200 border-b p-4">
          <div className="relative max-w-sm">
            <Search
              className="-translate-y-1/2 absolute top-1/2 left-3 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o unidad..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </DataTable>
    </div>
  );
};
