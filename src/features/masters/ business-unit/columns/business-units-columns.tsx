"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { ClientDataTableColumnHeader } from "@/components/data-table/client-data-table-column-header";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BusinessUnitResult } from "../schemas/business-units";
import { P } from "@/components/typography/p";

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

  //   {
  //     id: "actions",
  //     cell: ({ row }) => <ProjectDataTableRowActions row={row.original} />,
  //   },

];


