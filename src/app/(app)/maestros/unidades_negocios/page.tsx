import { Shell } from "@/components/shell";
import { H2 } from "@/components/typography/h2";
import { P } from "@/components/typography/p";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBusinessUnits } from "@/features/masters/ business-unit/actions/fetch-business-units";

const UnidadesNegociosPage = async () => {
  const data = await fetchBusinessUnits();
  return (
    <Shell>
      <section className="space-y-1.5 border-b pb-2">
        {" "}
        <H2>Unidades de Negocio</H2>
        <P>Unidades de Negocio</P>
      </section>
      <div>
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </Shell>
  );
};

export default UnidadesNegociosPage;
