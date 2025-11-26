"use client";
import { ArrowUpDown, Download, Filter, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { dictionaryNames } from "@/constants/dictionary";
import { valueFormat } from "@/lib/format";
import type { BudgetProject } from "../types";

interface BudgetListProps {
  data: BudgetProject[];
  title: string;
}

// Helper for status styling
const getStatusBadge = (status: string) => {
  let styles = "bg-slate-100 text-slate-800";
  const normalized = status.toLowerCase();
  switch (status.toLowerCase()) {
    case "approved":
      styles = "bg-emerald-100 text-emerald-800 border-emerald-200";
      break;
    case "created":
      styles = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case "rejected":
      styles = "bg-red-100 text-red-800 border-red-200";
      break;
    case "in review":
      styles = "bg-amber-100 text-amber-800 border-amber-200";
      break;
    case "closed":
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      break;
  }
  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-medium text-xs ${styles}`}
    >
      {dictionaryNames[normalized as keyof typeof dictionaryNames] ?? status}
    </span>
  );
};

export const BudgetList: React.FC<BudgetListProps> = ({ data, title }) => {
  const [filter, setFilter] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.project.toLowerCase().includes(filter.toLowerCase()) ||
      item.businessUnit.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-bold text-2xl text-slate-900">{title}</h2>
          <p className="text-slate-500">
            Gestión detallada de partidas presupuestarias
          </p>
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

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Table Toolbar */}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-slate-200 border-b bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  Unidad de Negocio
                </th>
                <th className="whitespace-nowrap px-6 py-4 font-medium">
                  Proyecto
                </th>
                <th className="px-6 py-4 font-medium">País</th>
                <th className="px-6 py-4 font-medium">Año</th>
                <th className="px-6 py-4 font-medium">Progreso</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="group cursor-pointer px-6 py-4 text-right font-medium transition-colors hover:bg-slate-100">
                  <div className="flex items-center justify-end gap-1">
                    Presupuesto
                    <ArrowUpDown
                      size={12}
                      className="text-slate-400 group-hover:text-slate-600"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="group transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {item.businessUnit.split("(")[0]}
                      <span className="block text-slate-400 text-xs">
                        {item.businessUnit.match(/\(([^)]+)\)/)?.[0]}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.project}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.country}</td>
                    <td className="px-6 py-4 text-slate-500">{item.year}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-xs">
                          {item.tasksInfo}
                        </span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{
                              width: `${
                                (parseInt(item.tasksInfo.split("/")[0], 10) /
                                  Math.max(
                                    parseInt(item.tasksInfo.split("/")[1], 10),
                                    1,
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-right font-medium font-mono text-slate-700">
                      ${valueFormat(item.budgetTotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No se encontraron resultados para su búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-slate-200 border-t bg-slate-50/50 px-6 py-4 text-slate-500 text-xs">
          <span>Mostrando {filteredData.length} resultados</span>
          <div className="flex gap-2">
            <button
              disabled
              className="rounded border border-slate-200 px-3 py-1 hover:bg-white disabled:opacity-50"
            >
              Anterior
            </button>
            <button className="rounded border border-slate-200 bg-white px-3 py-1 shadow-sm hover:bg-white">
              1
            </button>
            <button
              disabled
              className="rounded border border-slate-200 px-3 py-1 hover:bg-white disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
