"use server";

import { cacheLife, cacheTag } from "next/cache";

import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";
import {
  type FetchResult,
  HttpClientError,
  serverHttpClient,
} from "@/lib/http";

import type { CountryOption, MtCountry } from "../types";

interface DataResponse<T> {
  status: number;
  result: T;
  errorMessage?: unknown;
}

async function fetchCountryOptionsCached(
  token: string | null,
): Promise<FetchResult<CountryOption[]>> {
  // "use cache: remote";
  // cacheTag("masters-country-options");
  // cacheLife("minutes");

  try {
    const response = await serverHttpClient.get<DataResponse<MtCountry[]>>(
      "/MtCountry/GetDropdownItems?fieldNameValue=Id&fieldNameText=Name",
      undefined,
      undefined,
      token,
    );

    

    if (!response.result) {
    
      return {
        status: "error",
        error: response.errorMessage,
        code: response.status,
        message: '',
      };
    }

    const options = response.result.map((item) => ({
      label: item.text,
      value: item.value,
    }));

    console.log(options);

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

export async function getCountryOptions(): Promise<
  FetchResult<CountryOption[]>
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

  return fetchCountryOptionsCached(token);
}
