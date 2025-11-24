import { env } from "@/env";
import { auth } from "@/lib/auth";
import {
  type FetchResult,
  HttpMethod,
  type HttpRequest,
  type NextFetchOptions,
} from "./types";

/**
 * HTTP Client for Server-Side usage only.
 *
 * **IMPORTANT**: This client can ONLY be used in:
 * - Server Components
 * - Server Actions ('use server')
 * - Route Handlers (app/api/*)
 *
 * **DO NOT use in Client Components** - The `auth()` call will fail.
 *
 * For Client Components with TanStack Query, call Server Actions that use this client.
 *
 * @example
 * ```typescript
 * // ✅ Correct: Server Action
 * 'use server'
 * import { serverHttpClient } from '@/lib/http'
 *
 * export async function getUsers() {
 *   return serverHttpClient.get<User[]>('/User')
 * }
 *
 * // ✅ Correct: Client Component calling Server Action
 * 'use client'
 * import { useQuery } from '@tanstack/react-query'
 * import { getUsers } from '@/actions/users'
 *
 * export function UserList() {
 *   const { data } = useQuery({
 *     queryKey: ['users'],
 *     queryFn: getUsers
 *   })
 * }
 *
 * // ❌ Wrong: Client Component calling directly
 * 'use client'
 * import { serverHttpClient } from '@/lib/http'
 *
 * export function BadComponent() {
 *   const data = await serverHttpClient.get('/User') // ❌ WILL FAIL
 * }
 * ```
 */
class ServerHttpClient {
  private static instance: ServerHttpClient | null = null;
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  private constructor(
    baseUrl: string,
    defaultHeaders: Record<string, string> = {}
  ) {
    if (!baseUrl) {
      throw new Error("API_URL environment variable is not defined");
    }
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
  }

  static getInstance(): ServerHttpClient {
    if (!ServerHttpClient.instance) {
      ServerHttpClient.instance = new ServerHttpClient(env.API_URL);
    }
    return ServerHttpClient.instance;
  }

  async sendRequest<TResponse, TBody = unknown>(
    request: HttpRequest<TBody>
  ): Promise<FetchResult<TResponse>> {
    const url = this.buildUrl(request.endpoint);
    const headers = await this.buildHeaders(request.headers, request.body);

    try {
      // Build request body
      let bodyPayload: BodyInit | undefined;
      if (request.body instanceof FormData) {
        bodyPayload = request.body;
      } else if (request.body) {
        bodyPayload = JSON.stringify(request.body);
      }

      const response = await fetch(url, {
        method: HttpMethod[request.method],
        credentials: "include",
        headers,
        body: bodyPayload,
        cache: request.options?.cache,
        next: {
          revalidate: request.options?.next?.revalidate,
          tags: request.options?.next?.tags,
        },
      });

      if (!response.ok) {
        const dataError = await response.json();

        return {
          status: "error",
          code: response.status,
          message: dataError.message || response.statusText,
          error: dataError.message || response.statusText,
        };
      }

      // Parsear respuesta de la API
      // La API SIEMPRE devuelve ApiStandardResponse<TResponse>
      let data: TResponse;
      let code = response.status;
      let message = response.statusText;

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        const text = await response.text();

        if (text) {
          // SIEMPRE parsear como ApiStandardResponse
          const json = JSON.parse(text) as {
            status: number;
            result: TResponse;
            errorMessage: string | null;
            exceutionTime: string;
          };

          // Extraer valores de ApiStandardResponse
          code = json.status;
          message = json.errorMessage || "Success";

          // Verificar si es éxito (status 200)
          if (json.status === 200) {
            data = json.result;
          } else {
            // Error interno de la API
            return {
              status: "error",
              code: json.status,
              message,
              error: message,
            };
          }
        } else {
          // Respuesta vacía (ej: DELETE exitoso sin contenido)
          data = null as TResponse;
        }
      } else {
        // Sin content-type JSON (raro, pero posible)
        data = null as TResponse;
      }

      return {
        status: "success",
        data,
        code,
        message,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `Failed to fetch: ${error.message}`
          : "An unknown error occurred";
      return {
        status: "error",
        code: 500,
        message: errorMessage,
        error: errorMessage,
      };
    }
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private async buildHeaders(
    customHeaders?: Record<string, string>,
    body?: unknown
  ): Promise<HeadersInit> {
    const session = await auth();
    const token = session?.user?.accessTokenBank;

    const headers: HeadersInit = {
      ...this.defaultHeaders,
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...customHeaders,
    };

    // Agregar token de autorización si existe
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Solo agregar Content-Type para JSON, no para FormData
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  }

  // Métodos helper para cada verbo HTTP
  async get<TResponse>(
    endpoint: string,
    options?: NextFetchOptions,
    headers?: Record<string, string>
  ): Promise<FetchResult<TResponse>> {
    return await this.sendRequest<TResponse>({
      method: "GET",
      endpoint,
      headers,
      options,
    });
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: NextFetchOptions,
    headers?: Record<string, string>
  ): Promise<FetchResult<TResponse>> {
    return await this.sendRequest<TResponse, TBody>({
      method: "POST",
      endpoint,
      body,
      headers,
      options,
    });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: NextFetchOptions,
    headers?: Record<string, string>
  ): Promise<FetchResult<TResponse>> {
    return await this.sendRequest<TResponse, TBody>({
      method: "PUT",
      endpoint,
      body,
      headers,
      options,
    });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: NextFetchOptions,
    headers?: Record<string, string>
  ): Promise<FetchResult<TResponse>> {
    return await this.sendRequest<TResponse, TBody>({
      method: "PATCH",
      endpoint,
      body,
      headers,
      options,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    options?: NextFetchOptions,
    headers?: Record<string, string>
  ): Promise<FetchResult<TResponse>> {
    return await this.sendRequest<TResponse>({
      method: "DELETE",
      endpoint,
      headers,
      options,
    });
  }

  // Método estático legacy para compatibilidad hacia atrás
  static async execute<TResponse, TBody = unknown>(
    request: HttpRequest<TBody>
  ): Promise<FetchResult<TResponse>> {
    const httpClient = ServerHttpClient.getInstance();
    return await httpClient.sendRequest<TResponse, TBody>(request);
  }
}

/**
 * Singleton instance of ServerHttpClient for server-side HTTP requests.
 *
 * **Only use in Server Components, Server Actions, or Route Handlers.**
 *
 * @example
 * ```typescript
 * // In a Server Action
 * 'use server'
 * import { serverHttpClient } from '@/lib/http'
 *
 * export async function createUser(data: UserData) {
 *   return serverHttpClient.post<User>('/User', data)
 * }
 * ```
 */
export const serverHttpClient = ServerHttpClient.getInstance();
