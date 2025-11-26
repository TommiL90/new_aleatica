"use server";

import { updateTag } from "next/cache";

import { serverHttpClient } from "@/lib/http";

import type { BusinessUnitPayload } from "../schemas/business-units";

export async function updateBusinessUnit(
  id: number,
  payload: BusinessUnitPayload,
): Promise<{ error: string | null }> {
  const result = await serverHttpClient.put<void>(
    `/MtBusinessUnit/Update/${id}`,
    payload,
  );

  if (result.status === "error") {
    return {
      error: result.error ?? "Error al actualizar la unidad de negocio",
    };
  }

  updateTag("business-units");

  return { error: null };
}
