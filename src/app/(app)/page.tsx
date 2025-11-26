import React from "react";
import { getPanelInfo } from "@/features/summaries/actions/get-panel-info.action";
import { getSummaryOpCatalogsInfo } from "@/features/summaries/actions/get-summary-op-catalogs-info.action";
import { getSummaryOpProjectsInfo } from "@/features/summaries/actions/get-summary-op-projects-info.action";
import { getSummaryProjectsInfo } from "@/features/summaries/actions/get-summary-projects-info.action";

const AppPage = async () => {
  const data = await getPanelInfo();
  const data2 = await getSummaryOpCatalogsInfo();
  const data3 = await getSummaryOpProjectsInfo();
  const data4 = await getSummaryProjectsInfo();

  if(data2.status === 'error' || data3.status === 'error' || data4.status === 'error') {
    return <div>Error</div>;
  }

  return (
    <pre>
      <code>{JSON.stringify(data2.data, null, 2)}</code>
      <code>{JSON.stringify(data3.data, null, 2)}</code>
      <code>{JSON.stringify(data4.data, null, 2)}</code>
    </pre>
  );
};

export default AppPage;
