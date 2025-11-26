"use server";

import { updateTag } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";
import { serverHttpClient } from "@/lib/http";

export async function deleteBusinessUnit(
  id: number,
): Promise<{ error: string | null }> {
  try {
    const response = await serverHttpClient.delete<void>(
      `/MtBusinessUnit/DeleteAll?id=${id}`,
    );

    if (response.status !== 200) {
      return {
        error:
          response.errorMessage ?? "Error al eliminar la unidad de negocio",
      };
    }

    updateTag("business-units");
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
