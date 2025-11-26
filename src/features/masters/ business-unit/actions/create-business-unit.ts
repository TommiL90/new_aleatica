"use server";

import { updateTag } from "next/cache";

import { serverHttpClient } from "@/lib/http";

import type { BusinessUnitPayload } from "../schemas/business-units";

export async function createBusinessUnit(
  payload: BusinessUnitPayload,
): Promise<{ error: string | null }> {
  const result = await serverHttpClient.post<void>(
    "/MtBusinessUnit/Create",
    payload,
  );

  if (result.status === "error") {
    return {
      error: result.error ?? "Error al crear la unidad de negocio",
    };
  }

  updateTag("business-units");

  return { error: null };
}
