'use client';
import { DataTable } from "@/components/data-table/data-table";
import { businessUnitsColumns } from "@/features/masters/ business-unit/columns/business-units-columns";
import type { BusinessUnitResult } from "@/features/masters/ business-unit/schemas/business-units";
import { useClientDataTable } from "@/hooks/use-client-data-table";

interface UnitBusinessTableProps {
  data: BusinessUnitResult[];
}

export const UnitBusinessTable = ({ data }: UnitBusinessTableProps) => {
  const { table } = useClientDataTable({
    columns: businessUnitsColumns,
    data: data,
  });

  return (
    <div>
      <DataTable table={table} />
    </div>
  );
};
