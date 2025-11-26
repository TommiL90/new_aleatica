"use client";
import { Ellipsis } from "lucide-react";

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

interface BusinessUnitActionsCellProps {
  row: BusinessUnitResult;
}

export function BusinessUnitActionsCell({ row }: BusinessUnitActionsCellProps) {
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
}
