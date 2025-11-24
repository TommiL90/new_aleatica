"use server";

import { type FetchResult, serverHttpClient } from "@/lib/http";
import {
  type PanelInfo,
  panelInfoSchema,
} from "@/schemas/summaries/panel-info.schema";

/**
 * Server Action para obtener la información del panel
 * Endpoint: /Summary/GetPanelInfo
 *
 * ⭐ El parsing con Zod ES el mapper - valida, aplica defaults y transforma datos
 */
export async function getPanelInfo(): Promise<FetchResult<PanelInfo>> {
  // 1. Llamar API
  // Ahora serverHttpClient extrae automáticamente 'result' de la respuesta estándar
  const result = await serverHttpClient.get<PanelInfo>("/Summary/GetPanelInfo");

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
      code: result.code,
      message: result.message,
    };
  }

  // 2. Parsear con Zod
  // result.data ahora contiene directamente el objeto PanelInfo (sin el wrapper de la API)
  const parsed = panelInfoSchema.safeParse(result.data);

  if (!parsed.success) {
    // ⚠️ CRÍTICO: NO usar defaults si falla el parsing
    // Retornar error controlado para que la UI pueda manejarlo
    const errorMessage = `Error al parsear respuesta: ${parsed.error.message}`;
    return {
      status: "error",
      error: errorMessage,
      code: 502, // Bad Gateway - el backend retornó datos inválidos
      message: errorMessage,
    };
  }

  // 3. Los datos ya están parseados y transformados por Zod
  return {
    status: "success",
    data: parsed.data,
    code: result.code,
    message: result.message,
  };
}
