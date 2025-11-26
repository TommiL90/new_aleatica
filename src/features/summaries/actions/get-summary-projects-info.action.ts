"use server";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  type SummaryProjectsInfo,
  summaryProjectsInfoSchema,
} from "@/features/summaries/schemas/summary-projects-info.schema";
import { auth } from "@/lib/auth";
import { type FetchResult, serverHttpClient } from "@/lib/http";

async function fetchSummaryProjectsInfoCached(
  token: string | null,
): Promise<FetchResult<SummaryProjectsInfo>> {
  "use cache: private";
  cacheTag("summary-projects-info");
  cacheLife("minutes");

  const response = await serverHttpClient.get<unknown>(
    "/Summary/GetProjectsInfo",
    { token },
  );

  if (response.status !== 200 || typeof response.result === "undefined") {
    const errorMessage =
      response.errorMessage ?? "Error al obtener los proyectos (Summary)";
    return {
      status: "error",
      error: errorMessage,
      code: response.status,
      message: errorMessage,
    };
  }

  const parsed = summaryProjectsInfoSchema.safeParse(response.result);

  if (!parsed.success) {
    const errorMessage = `Error al parsear Summary/GetProjectsInfo: ${parsed.error.message}`;
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

export async function getSummaryProjectsInfo(): Promise<
  FetchResult<SummaryProjectsInfo>
> {
  const session = await auth();
  const token = session?.user.accessTokenBank ?? null;

  if (!token) {
    redirect("/login");
  }

  return fetchSummaryProjectsInfoCached(token);
}
