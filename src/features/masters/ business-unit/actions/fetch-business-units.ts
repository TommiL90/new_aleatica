"use server";

import { cacheLife, cacheTag } from "next/cache";
import { auth } from "@/lib/auth";
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
import { redirect } from "next/navigation";

/**
 * Función interna cacheada que realiza el fetch usando serverHttpClient con token.
 *
 * Usa 'use cache: remote' para cachear datos compartidos entre usuarios en contextos dinámicos.
 * El token se pasa como parámetro a serverHttpClient para evitar llamar a auth()
 * dentro de 'use cache: remote'.
 *
 * IMPORTANTE:
 * - 'use cache: remote' funciona en contextos dinámicos (después de connection(), cookies(), headers())
 * - 'use cache' NO funciona en contextos dinámicos (se ignora completamente)
 * - El layout (app)/(app)/layout.tsx tiene await connection(), haciendo todo el contexto dinámico
 * - Por lo tanto, DEBEMOS usar 'use cache: remote' para que el cache funcione
 *
 * Si los datos son compartidos entre usuarios (todos ven las mismas unidades de negocio),
 * el cache funcionará correctamente. Si cada usuario tiene datos diferentes,
 * considera usar 'use cache: private' en su lugar.
 */
async function fetchBusinessUnitsCached(
  token: string | null,
): Promise<FetchResult<ArrayBusinessUnitResult>> {
  "use cache: remote";
  cacheTag("business-units");
  cacheLife('minutes');

  // Usar serverHttpClient con el token pasado como parámetro
  // Esto evita que serverHttpClient llame a auth() internamente
  const result = await serverHttpClient.get<
    PaginatedResponse<BusinessUnitResult[]>
  >(
    "/MtBusinessUnit/GetAllPaginated?&PageSize=2147483647",
    undefined,
    undefined,
    token,
  );

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

  // Extraer los datos validados del segundo wrapper
  // parsed.data contiene: { status, result, errorMessage, exceutionTime }
  // parsed.data.result contiene: { currentPage, pageCount, pageSize, recordCount, results }
  return {
    status: "success",
    data: parsed.data,
    code: result.code,
    message: result.message,
  };
}

/**
 * Server Action para obtener las unidades de negocio paginadas
 * Endpoint: /MtBusinessUnit/GetAllPaginated
 *
 * Este endpoint tiene un doble wrapper:
 * 1. La API devuelve ApiStandardResponse<PaginatedResponse<BusinessUnitResult[]>>
 * 2. Dentro hay otro ApiResponseWrapper que contiene los datos paginados
 *
 * Usa 'use cache: remote' para cachear datos compartidos entre usuarios en contextos dinámicos.
 * Ideal para datos de referencia que todos los usuarios autenticados ven iguales.
 *
 * IMPORTANTE:
 * - El layout (app)/(app)/layout.tsx tiene await connection(), haciendo todo el contexto dinámico
 * - En contextos dinámicos, 'use cache' NO funciona (se ignora)
 * - Por lo tanto, DEBEMOS usar 'use cache: remote' para que el cache funcione
 * - Obtiene el token de autenticación ANTES de entrar a la función cacheada
 *   para evitar el error de usar headers() dentro de 'use cache: remote'.
 *
 * Referencia: https://nextjs.org/docs/app/api-reference/directives/use-cache-remote
 */
export async function fetchBusinessUnits(): Promise<
  FetchResult<ArrayBusinessUnitResult>
> {
  // Obtener el token ANTES de entrar a la función cacheada
  // Esto evita el error de usar headers() dentro de 'use cache: remote'
  const session = await auth();
  const token = session?.user.accessTokenBank
  
  if (!token) {
    redirect("/login");
  }

  // Llamar a la función cacheada pasando el token como parámetro
  return fetchBusinessUnitsCached(token);
}
