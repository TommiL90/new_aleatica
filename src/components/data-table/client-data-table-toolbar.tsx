"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useMemo } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface Option {
  label: string;
  value: string;
}

export interface Options {
  [groupKey: string]: Option[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  placeholderSearchInput?: string;
  options?: Options;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  placeholderSearchInput,
  options,
}: DataTableToolbarProps<TData>) {
  const rowExists = useMemo(() => {
    return (name: string) =>
      table
        .getAllColumns()
        .map((column) => column.id)
        .includes(name);
  }, [table]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            type="search"
            placeholder={placeholderSearchInput ?? "Buscar..."}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {rowExists("origin") && table.getColumn("origin") && (
          <DataTableFacetedFilter
            column={table.getColumn("origin")}
            title="Origem"
            options={options?.origin ?? []}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
