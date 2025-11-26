"use client";
import type { ColumnDef } from "@tanstack/react-table";

import { ClientDataTableColumnHeader } from "@/components/data-table/client-data-table-column-header";
import { BusinessUnitActionsCell } from "../actions-cells/business-unit-actions-cell";
import type { BusinessUnitResult } from "../schemas/business-units";

export const businessUnitsColumns: ColumnDef<BusinessUnitResult>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Código" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[350px] space-x-2">
        {/* <Badge variant="outline"> {row.original.version}</Badge> */}
        <span>{row.getValue("code")}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "mtCountry",
    header: ({ column }) => (
      <ClientDataTableColumnHeader column={column} title="País" />
    ),
    cell: ({ row }) => <div>{row.getValue("mtCountry")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <BusinessUnitActionsCell row={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
];
