"use server";

import { type FetchResult, serverHttpClient } from "@/lib/http";
import {
  type PaginatedResponse,
  PaginatedResponseSchema,
} from "@/schemas/paginated-response";
import {
  type ArrayBusinessUnitResult,
  arrayBusinessUnitResultSchema,
  type BusinessUnitResult,
} from "../schemas/business-units";

/**
 * Server Action para obtener las unidades de negocio paginadas
 * Endpoint: /MtBusinessUnit/GetAllPaginated
 *
 * Este endpoint tiene un doble wrapper:
 * 1. serverHttpClient extrae el primer 'result'
 * 2. Dentro hay otro ApiResponseWrapper que contiene los datos paginados
 */
export async function fetchBusinessUnits(): Promise<
  FetchResult<ArrayBusinessUnitResult>
> {
  // 1. Llamar API con el tipo que refleja el doble wrapper
  const result = await serverHttpClient.get<
    PaginatedResponse<BusinessUnitResult[]>
  >("/MtBusinessUnit/GetAllPaginated?&PageSize=2147483647");

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
      code: result.code,
      message: result.message,
    };
  }

  const parsed = arrayBusinessUnitResultSchema.safeParse(result.data.results);

  if (!parsed.success) {
    const errorMessage = `Error al parsear respuesta: ${parsed.error.message}`;
    return {
      status: "error",
      error: errorMessage,
      code: 502, // Bad Gateway - el backend retornó datos inválidos
      message: errorMessage,
    };
  }

  // 5. Extraer los datos validados del segundo wrapper
  // parsed.data contiene: { status, result, errorMessage, exceutionTime }
  // parsed.data.result contiene: { currentPage, pageCount, pageSize, recordCount, results }
  return {
    status: "success",
    data: result.data.results,
    code: result.code,
    message: result.message,
  };
}
