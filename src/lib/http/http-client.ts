import { env } from "@/env";
import { auth } from "@/lib/auth";
import { HttpClientError } from "./http-error";
import {
  type ApiStandardResponse,
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
 * **NEW**: All methods now accept an optional `token` parameter as the last argument.
 * If provided, the client will use this token instead of calling `auth()` internally.
 * This is useful when using with 'use cache: remote' where auth() is not allowed.
 *
 * @example
 * ```typescript
 * // ✅ Correct: Server Action (default behavior - uses auth())
 * 'use server'
 * import { serverHttpClient } from '@/lib/http'
 *
 * export async function getUsers() {
 *   return serverHttpClient.get<User[]>('/User')
 * }
 *
 * // ✅ Correct: Server Action with 'use cache: remote' (pass token explicitly)
 * 'use server'
 * import { auth } from '@/lib/auth'
 * import { serverHttpClient } from '@/lib/http'
 *
 * export async function getUsers() {
 *   const session = await auth() // Get token outside cached function
 *   const token = session?.user?.accessTokenBank ?? null
 *
 *   return fetchUsersCached(token)
 * }
 *
 * async function fetchUsersCached(token: string | null) {
 *   'use cache: remote'
 *   // Pass token to avoid calling auth() inside cached function
 *   return serverHttpClient.get<User[]>('/User', undefined, undefined, token)
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
    defaultHeaders: Record<string, string> = {},
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
    request: HttpRequest<TBody>,
  ): Promise<ApiStandardResponse<TResponse>> {
    const url = this.buildUrl(request.endpoint);
    const headers = await this.buildHeaders(
      request.headers,
      request.body,
      request.token,
    );

    // Build request body
    let bodyPayload: BodyInit | undefined;
    if (request.body instanceof FormData) {
      bodyPayload = request.body;
    } else if (request.body) {
      bodyPayload = JSON.stringify(request.body);
    }

    let response: Response;
    try {
      response = await fetch(url, {
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
    } catch (error) {
      throw new HttpClientError(
        error instanceof Error
          ? `Failed to fetch ${request.endpoint}: ${error.message}`
          : `Failed to fetch ${request.endpoint}`,
        500,
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    const responseText = await response.text();

    if (!responseText) {
      return {
        status: response.status,
        result: null as TResponse,
        errorMessage: null,
        exceutionTime: "",
      };
    }

    if (!contentType.includes("application/json")) {
      throw new HttpClientError(
        `Expected JSON response but received ${contentType || "unknown"}`,
        response.status,
        responseText,
      );
    }

    try {
      return JSON.parse(responseText) as ApiStandardResponse<TResponse>;
    } catch (error) {
      throw new HttpClientError(
        "Failed to parse JSON response",
        response.status,
        responseText,
      );
    }
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private async buildHeaders(
    customHeaders?: Record<string, string>,
    body?: unknown,
    providedToken?: string | null,
  ): Promise<HeadersInit> {
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...customHeaders,
    };

    // Si se proporciona un token explícitamente, usarlo sin llamar a auth()
    // Esto permite usar serverHttpClient con 'use cache: remote'
    if (providedToken !== undefined) {
      if (providedToken) {
        headers.Authorization = `Bearer ${providedToken}`;
      }
    } else {
      // Comportamiento por defecto: obtener token de auth()
      // Solo se ejecuta si no se proporciona token explícitamente
      const session = await auth();
      const token = session?.user?.accessTokenBank;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
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
    headers?: Record<string, string>,
    token?: string | null,
  ): Promise<ApiStandardResponse<TResponse>> {
    return await this.sendRequest<TResponse>({
      method: "GET",
      endpoint,
      headers,
      options,
      token,
    });
  }

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: NextFetchOptions,
    headers?: Record<string, string>,
    token?: string | null,
  ): Promise<ApiStandardResponse<TResponse>> {
    return await this.sendRequest<TResponse, TBody>({
      method: "POST",
      endpoint,
      body,
      headers,
      options,
      token,
    });
  }

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: NextFetchOptions,
    headers?: Record<string, string>,
    token?: string | null,
  ): Promise<ApiStandardResponse<TResponse>> {
    return await this.sendRequest<TResponse, TBody>({
      method: "PUT",
      endpoint,
      body,
      headers,
      options,
      token,
    });
  }

  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: NextFetchOptions,
    headers?: Record<string, string>,
    token?: string | null,
  ): Promise<ApiStandardResponse<TResponse>> {
    return await this.sendRequest<TResponse, TBody>({
      method: "PATCH",
      endpoint,
      body,
      headers,
      options,
      token,
    });
  }

  async delete<TResponse>(
    endpoint: string,
    options?: NextFetchOptions,
    headers?: Record<string, string>,
    token?: string | null,
  ): Promise<ApiStandardResponse<TResponse>> {
    return await this.sendRequest<TResponse>({
      method: "DELETE",
      endpoint,
      headers,
      options,
      token,
    });
  }

  // Método estático legacy para compatibilidad hacia atrás
  static async execute<TResponse, TBody = unknown>(
    request: HttpRequest<TBody>,
  ): Promise<ApiStandardResponse<TResponse>> {
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
