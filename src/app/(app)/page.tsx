import React from "react";
import { getPanelInfo } from "@/features/summaries/actions/get-panel-info.action";
import { getSummaryOpCatalogsInfo } from "@/features/summaries/actions/get-summary-op-catalogs-info.action";
import { getSummaryOpProjectsInfo } from "@/features/summaries/actions/get-summary-op-projects-info.action";
import { getSummaryProjectsInfo } from "@/features/summaries/actions/get-summary-projects-info.action";
import type { Data1, Tipo2, Tipo3 } from "@/features/summaries/types";
import { Dashboard } from "@/features/summaries/components/dashboard";
import { BudgetList } from "@/features/summaries/components/budget-list";
import { Shell } from "@/components/shell";

const AppPage = async () => {
  const data = await getPanelInfo();
  const data2 = await getSummaryOpCatalogsInfo();
  const data3 = await getSummaryOpProjectsInfo();
  const data4 = await getSummaryProjectsInfo();

  if (
    data2.status === "error" ||
    data3.status === "error" ||
    data4.status === "error"
  ) {
    return <div>Error</div>;
  }

  const kpis: Data1 = MOCK_DATA_1;
  const activeBudgets: Tipo2 = MOCK_DATA_2;
  const historicalBudgets: Tipo3 = MOCK_DATA_3;

  return (
    <Shell className="space-y-6">
      <section>
        <Dashboard kpis={kpis} budgets={activeBudgets} />
      </section>

      {/* Active Budgets Table Section */}
      <section>
        <BudgetList data={activeBudgets} title="Presupuestos 2026" />
      </section>

      {/* Historical Budgets Table Section */}
      <section>
        <BudgetList
          data={historicalBudgets}
          title="Histórico de Presupuestos"
        />
      </section>

      <pre>
        <code>{JSON.stringify(data2.data, null, 2)}</code>
        <code>{JSON.stringify(data3.data, null, 2)}</code>
        <code>{JSON.stringify(data4.data, null, 2)}</code>
      </pre>
    </Shell>
  );
};

export default AppPage;

// Mock Data provided in the prompt
const MOCK_DATA_1: Data1 = {
  simpleCatalogCount: 784,
  compositeCatalogCount: 629,
  materialsCatalogCount: 4645,
  compositeWorkCount: 63,
};

const MOCK_DATA_2: Tipo2 = [
  {
    businessUnit: "Libramiento Elevado Puebla (LEP)",
    country: "México",
    year: 2026,
    tasksInfo: "0/111",
    status: "Created",
    budgetTotal: "24513594.179999996",
    project: "Proyecto de Prueba LEP",
  },
  {
    businessUnit: "Circuito Exterior Mexiquense (CONMEX)",
    country: "México",
    year: 2026,
    tasksInfo: "0/219",
    status: "Rejected",
    budgetTotal: "-15144795855.73",
    project: "Presupuesto CONMEX 2026",
  },
  {
    businessUnit: "Autopista Urbana Norte (AUN)",
    country: "México",
    year: 2026,
    tasksInfo: "12/50",
    status: "Approved",
    budgetTotal: "12500000.00",
    project: "Mantenimiento AUN 2026",
  },
  {
    businessUnit: "Viaducto Bicentenario (VB)",
    country: "México",
    year: 2026,
    tasksInfo: "5/120",
    status: "In Review",
    budgetTotal: "8900000.50",
    project: "Expansión VB Fase 2",
  },
];

const MOCK_DATA_3: Tipo3 = [
  {
    businessUnit: "Libramiento Elevado Puebla (LEP)",
    country: "México",
    year: 2021,
    tasksInfo: "0/7",
    status: "Created",
    budgetTotal: "0.00",
    project: "Proeyecto bastiat",
  },
  {
    businessUnit: "Circuito Exterior Mexiquense (CONMEX)",
    country: "México",
    year: 2021,
    tasksInfo: "219/219",
    status: "Approved",
    budgetTotal: "45000000.00",
    project: "Cierre Fiscal 2021",
  },
];
