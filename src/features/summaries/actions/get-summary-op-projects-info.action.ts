"use server";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  type SummaryOpProjectsInfo,
  summaryOpProjectsInfoSchema,
} from "@/features/summaries/schemas/summary-op-projects-info.schema";
import { auth } from "@/lib/auth";
import { type FetchResult, serverHttpClient } from "@/lib/http";

async function fetchSummaryOpProjectsInfoCached(
  token: string | null,
): Promise<FetchResult<SummaryOpProjectsInfo>> {
  "use cache: private";
  cacheTag("summary-op-projects-info");
  cacheLife("minutes");

  const response = await serverHttpClient.get<unknown>(
    "/SummaryOp/GetProjectsInfo",
    { token },
  );

  if (response.status !== 200 || typeof response.result === "undefined") {
    const errorMessage =
      response.errorMessage ?? "Error al obtener los proyectos (SummaryOp)";
    return {
      status: "error",
      error: errorMessage,
      code: response.status,
      message: errorMessage,
    };
  }

  const parsed = summaryOpProjectsInfoSchema.safeParse(response.result);

  if (!parsed.success) {
    const errorMessage = `Error al parsear SummaryOp/GetProjectsInfo: ${parsed.error.message}`;
    return {
      status: "error",
      error: errorMessage,
      code: 502,
      message: errorMessage,
    };
  }

  return {
    status: "success",
    data: parsed.data,
    code: response.status,
    message: response.errorMessage ?? "Success",
  };
}

export async function getSummaryOpProjectsInfo(): Promise<
  FetchResult<SummaryOpProjectsInfo>
> {
  const session = await auth();
  const token = session?.user.accessTokenBank ?? null;

  if (!token) {
    redirect("/login");
  }

  return fetchSummaryOpProjectsInfoCached(token);
}
