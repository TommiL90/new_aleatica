"use server";

import {
  type PanelInfo,
  panelInfoSchema,
} from "@/features/summaries/schemas/panel-info.schema";
import { getErrorMessage } from "@/lib/handle-error";
import {
  type FetchResult,
  HttpClientError,
  serverHttpClient,
} from "@/lib/http";

/**
 * Server Action para obtener la información del panel
 * Endpoint: /Summary/GetPanelInfo
 *
 * ⭐ El parsing con Zod ES el mapper - valida, aplica defaults y transforma datos
 */
export async function getPanelInfo(): Promise<FetchResult<PanelInfo>> {
  const response = await serverHttpClient.get<PanelInfo>(
    "/Summary/GetPanelInfo",
  );

  if (!response.result) {
    console.log(response);
    const errorMessage =
      response.errorMessage ?? "Error al obtener la información del panel";
    return {
      status: "error",
      error: errorMessage,
      code: response.status,
      message: errorMessage,
    };
  }

  const parsed = panelInfoSchema.safeParse(response.result);

  if (!parsed.success) {
    const errorMessage = `Error al parsear respuesta: ${parsed.error.message}`;
    console.log(errorMessage);
    return {
      status: "error",
      error: errorMessage,
      code: 502, // Bad Gateway - el backend retornó datos inválidos
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
