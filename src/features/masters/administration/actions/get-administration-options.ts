"use server";

import { cacheLife, cacheTag } from "next/cache";

import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";
import {
  type FetchResult,
  HttpClientError,
  serverHttpClient,
} from "@/lib/http";

import type { AdministrationOption, MtAdministration } from "../types";

interface DataResponse<T> {
  status: number;
  result: T;
  errorMessage?: unknown;
}

async function fetchAdministrationOptionsCached(
  token: string | null,
): Promise<FetchResult<AdministrationOption[]>> {
  "use cache: remote";
  cacheTag("masters-administration-options");
  cacheLife("minutes");

  try {
    const response = await serverHttpClient.get<
      DataResponse<MtAdministration[]>
    >("/MtAdministration/GetAll", undefined, undefined, token);

    if (response.status !== 200 || !response.result?.result) {
      const errorMessage =
        (response.result?.errorMessage as string | undefined) ??
        response.errorMessage ??
        "Error al cargar las administraciones";

      return {
        status: "error",
        error: errorMessage,
        code: response.status,
        message: errorMessage,
      };
    }

    const options = response.result.result.map((item) => ({
      label: item.name,
      value: item.id,
      countryId: item.mtCountryId,
    }));

    return {
      status: "success",
      data: options,
      code: response.status,
      message: response.errorMessage ?? "Success",
    };
  } catch (error) {
    const message = getErrorMessage(error);
    const code = error instanceof HttpClientError ? error.statusCode : 500;
    return {
      status: "error",
      error: message,
      code,
      message,
    };
  }
}

export async function getAdministrationOptions(): Promise<
  FetchResult<AdministrationOption[]>
> {
  const session = await auth();
  const token = session?.user.accessTokenBank ?? null;

  if (!token) {
    const message = "Sesión no válida";
    return {
      status: "error",
      error: message,
      code: 401,
      message,
    };
  }

  return fetchAdministrationOptionsCached(token);
}
