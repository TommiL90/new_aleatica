"use server";

import { updateTag } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";
import { serverHttpClient } from "@/lib/http";

import type { BusinessUnitPayload } from "../schemas/business-units";

export async function createBusinessUnit(
  payload: BusinessUnitPayload,
): Promise<{ error: string | null }> {
  try {
    const response = await serverHttpClient.post<void>(
      "/MtBusinessUnit/Create",
      {
        body: payload,
      },
    );

    if (response.status !== 200) {
      return {
        error: response.errorMessage ?? "Error al crear la unidad de negocio",
      };
    }

    updateTag("business-units");

    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
