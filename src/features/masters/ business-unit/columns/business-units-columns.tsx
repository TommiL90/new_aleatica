"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

import { ClientDataTableColumnHeader } from "@/components/data-table/client-data-table-column-header";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Estado</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Activo</DropdownMenuItem>
                <DropdownMenuItem>Inactivo</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },

];


