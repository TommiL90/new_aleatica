import React from "react";
import { getPanelInfo } from "@/features/summaries/actions/get-panel-info.action";

const AppPage = async () => {
  const data = await getPanelInfo();
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

export default AppPage;
