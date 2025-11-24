export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type NextFetchOptions = {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

export type HttpRequest<TBody = unknown> = {
  method: keyof typeof HttpMethod;
  endpoint: string;
  body?: TBody;
  headers?: Record<string, string>;
  options?: NextFetchOptions;
};

export type FetchResult<TData> =
  | {
      status: "success";
      data: TData;
      message: string;
      code: number;
    }
  | {
      status: "error";
      error: string;
      code: number;
      message: string;
    };

// Tipo interno para la respuesta raw de la API
export interface ApiStandardResponse<T> {
  status: number;
  result: T;
  errorMessage: string | null;
  exceutionTime: string;
}
