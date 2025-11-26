import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";
import { H2 } from "@/components/typography/h2";
import { P } from "@/components/typography/p";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBusinessUnits } from "@/features/masters/ business-unit/actions/fetch-business-units";
import { UnitBusinessTable } from "./unit-business-table";

const UnidadesNegociosPage = async () => {
  const response = await fetchBusinessUnits();

  if (response.status === "error") {
    return (
      <Shell>
        <section className="space-y-1.5 border-b pb-2">
          <H2>Unidades de Negocio</H2>
        </section>
      </Shell>
    );
  }

  const data = response.data;

  return (
    <Shell>
      <section className="space-y-1.5 border-b pb-2">
        {" "}
        <H2>Unidades de Negocio</H2>
        <P>Unidades de Negocio</P>
      </section>
      {/* <DataTableSkeleton
            columnCount={7}
            filterCount={4}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          /> */}
      <UnitBusinessTable data={data} />
    </Shell>
  );
};

export default UnidadesNegociosPage;
