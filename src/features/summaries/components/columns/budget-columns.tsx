"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ClientDataTableColumnHeader } from "@/components/data-table/client-data-table-column-header";
import { valueFormat } from "@/lib/format";
import type { SummaryOpProjectInfo } from "../../schemas/summary-op-projects-info.schema";
import type { SummaryProjectInfo } from "../../schemas/summary-projects-info.schema";
import { translateStatusLabel } from "../../utils/status-label";

const getProgress = (tasksInfo: string) => {
  const parts = tasksInfo.split("/").map((value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const done = parts[0] ?? 0;
  const total = parts[1] ?? 0;
  const safeTotal = Math.max(total, 1);
  return Math.min(100, Math.max(0, (done / safeTotal) * 100));
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();
  const label = translateStatusLabel(status);

  const styles = {
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    created: "bg-blue-100 text-blue-800 border-blue-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    "in review": "bg-amber-100 text-amber-800 border-amber-200",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
  } as const;

  const className =
    styles[normalized as keyof typeof styles] ??
    "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-medium text-xs ${className}`}
    >
      {label}
    </span>
  );
};

export const budgetColumns: ColumnDef<
  SummaryOpProjectInfo | SummaryProjectInfo
>[] = [
  {
    accessorKey: "businessUnit",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Unidad de negocio" />
    ),
    cell: ({ row }) => {
      const businessUnit = row.original.businessUnit;
      const [name, detail] = businessUnit.split("(");
      const detailClean = detail?.replace(/\)$/, "").trim() ?? undefined;

      return (
        <div className="font-medium text-slate-700">
          {name?.trim()}
          {detailClean && (
            <span className="block text-slate-400 text-xs">
              ({detailClean})
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Proyecto" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.project}</span>
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="País" />
    ),
    cell: ({ row }) => (
      <span className="text-slate-500">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Año" />
    ),
    cell: ({ row }) => (
      <span className="text-slate-500">{row.original.year}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tasksInfo",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Progreso" />
    ),
    cell: ({ row }) => {
      const tasksInfo = row.original.tasksInfo;
      const progress = getProgress(tasksInfo);

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-500 text-xs">{tasksInfo}</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "budgetTotal",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Presupuesto" />
    ),
    cell: ({ row }) => (
      <span className="text-right font-medium font-mono text-slate-700">
        ${valueFormat(row.original.budgetTotal)}
      </span>
    ),
    enableSorting: true,
  },
];
