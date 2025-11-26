"use server";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

import {
  type SummaryOpCatalogsInfo,
  summaryOpCatalogsInfoSchema,
} from "@/features/summaries/schemas/summary-op-catalogs-info.schema";
import { auth } from "@/lib/auth";
import { type FetchResult, serverHttpClient } from "@/lib/http";

async function fetchSummaryOpCatalogsInfoCached(
  token: string | null,
): Promise<FetchResult<SummaryOpCatalogsInfo>> {
  "use cache: private";
  cacheTag("summary-op-catalogs-info");
  cacheLife("minutes");

  const response = await serverHttpClient.get<unknown>(
    "/SummaryOp/GetCatalogsInfo",
    { token },
  );

  if (response.status !== 200 || typeof response.result === "undefined") {
    const errorMessage =
      response.errorMessage ?? "Error al obtener los catálogos (SummaryOp)";
    return {
      status: "error",
      error: errorMessage,
      code: response.status,
      message: errorMessage,
    };
  }

  const parsed = summaryOpCatalogsInfoSchema.safeParse(response.result);

  if (!parsed.success) {
    const errorMessage = `Error al parsear SummaryOp/GetCatalogsInfo: ${parsed.error.message}`;
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

export async function getSummaryOpCatalogsInfo(): Promise<
  FetchResult<SummaryOpCatalogsInfo>
> {
  const session = await auth();
  const token = session?.user.accessTokenBank ?? null;

  if (!token) {
    redirect("/login");
  }

  return fetchSummaryOpCatalogsInfoCached(token);
}
