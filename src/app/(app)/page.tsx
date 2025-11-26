import { Shell } from "@/components/shell";
import { getSummaryOpCatalogsInfo } from "@/features/summaries/actions/get-summary-op-catalogs-info.action";
import { getSummaryOpProjectsInfo } from "@/features/summaries/actions/get-summary-op-projects-info.action";
import { getSummaryProjectsInfo } from "@/features/summaries/actions/get-summary-projects-info.action";
import { BudgetList } from "@/features/summaries/components/budget-list";
import { Dashboard } from "@/features/summaries/components/dashboard";
import type { SummaryOpCatalogsInfo } from "@/features/summaries/schemas/summary-op-catalogs-info.schema";

const AppPage = async () => {
  const [catalogInfoResponse, opProjectsResponse, projectsResponse] =
    await Promise.all([
      getSummaryOpCatalogsInfo(),
      getSummaryOpProjectsInfo(),
      getSummaryProjectsInfo(),
    ]);

  const hasError =
    catalogInfoResponse.status === "error" ||
    opProjectsResponse.status === "error" ||
    projectsResponse.status === "error";

  if (hasError) {
    return (
      <Shell>
        <section className="space-y-1.5 border-b pb-2">
          <h2 className="font-semibold text-2xl text-slate-900">
            Resumen Ejecutivo
          </h2>
          <p className="text-slate-500">
            No fue posible cargar la información del resumen.
          </p>
        </section>
      </Shell>
    );
  }

  const catalogData: SummaryOpCatalogsInfo = catalogInfoResponse.data;

  const activeBudgets = opProjectsResponse.data;
  const historicalBudgets = projectsResponse.data;

  return (
    <Shell className="space-y-6">
      <section>
        <Dashboard kpis={catalogData} budgets={activeBudgets} />
      </section>
      <section>
        <BudgetList data={activeBudgets} title="Presupuestos activos" />
      </section>
      <section>
        <BudgetList
          data={historicalBudgets}
          title="Histórico de presupuestos"
        />
      </section>
    </Shell>
  );
};

export default AppPage;
