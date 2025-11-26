"use server";

import {
  type PanelInfo,
  panelInfoSchema,
} from "@/features/summaries/schemas/panel-info.schema";
import {
  HttpClientError,
  type FetchResult,
  serverHttpClient,
} from "@/lib/http";
import { getErrorMessage } from "@/lib/handle-error";

/**
 * Server Action para obtener la información del panel
 * Endpoint: /Summary/GetPanelInfo
 *
 * ⭐ El parsing con Zod ES el mapper - valida, aplica defaults y transforma datos
 */
export async function getPanelInfo(): Promise<FetchResult<PanelInfo>> {
  try {
    const response = await serverHttpClient.get<PanelInfo>(
      "/Summary/GetPanelInfo",
    );

    if (response.status !== 200 || !response.result) {
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
