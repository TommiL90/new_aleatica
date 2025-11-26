"use server";

import { updateTag } from "next/cache";
import { serverHttpClient } from "@/lib/http";

export async function deleteBusinessUnit(
  id: number
): Promise<{ error: string | null }> {
  // Llamar al endpoint DELETE con el ID como query param
  const result = await serverHttpClient.delete<void>(
    `/MtBusinessUnit/DeleteAll?id=${id}`
  );

  // Manejar error
  if (result.status === "error") {
    return {
      error: result.error || "Error al eliminar la unidad de negocio",
    };
  }

  // Revalidar cache (Next.js 16 usa updateTag)
  updateTag("business-units");

  return { error: null };
}
