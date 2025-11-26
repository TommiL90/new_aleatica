"use server";

import { getErrorMessage } from "@/lib/handle-error";
import { serverHttpClient } from "@/lib/http";
import type { DataResponse } from "@/types/data-response";

/**
 * Interfaces for master data types
 */
interface MtCountry {
  disabled: boolean;
  group?: unknown;
  selected: boolean;
  text: string;
  value: string;
}

interface MtAdministration {
  mtCountry: string;
  mtCountryId: number;
  name: string;
  id: number;
  disabled: boolean;
}

/**
 * Option format returned to client
 */
export interface CountryOption {
  label: string;
  value: number;
}

export interface AdministrationOption {
  label: string;
  value: number;
  countryId: number;
}

/**
 * Fetch country options from API
 * Used for the "País" dropdown field
 */
export async function getCountryOptions(): Promise<{
  error: string | null;
  data: CountryOption[] | null;
}> {
  try {
    const response = await serverHttpClient.get<DataResponse<MtCountry[]>>(
      "/MtCountry/GetDropdownItems?fieldNameValue=Id&fieldNameText=Name",
    );

    if (response.status !== 200 || !response.result) {
      return {
        error:
          (response.errorMessage as string) ?? "Error al cargar los países",
        data: null,
      };
    }

    const options = response.result.map((item) => ({
      label: item.text,
      value: Number(item.value),
    }));

    return { error: null, data: options };
  } catch (error) {
    return { error: getErrorMessage(error), data: null };
  }
}

/**
 * Fetch administration options from API
 * Used for the "Administraciones" multi-select field
 * Each option includes countryId for filtering based on selected country
 */
export async function getAdministrationOptions(): Promise<{
  error: string | null;
  data: AdministrationOption[] | null;
}> {
  try {
    const response = await serverHttpClient.get<
      DataResponse<MtAdministration[]>
    >("/MtAdministration/GetAll");

    if (response.status !== 200 || !response.result) {
      return {
        error:
          (response.errorMessage as string) ??
          "Error al cargar las administraciones",
        data: null,
      };
    }

    const options = response.result.map((item) => ({
      label: item.name,
      value: item.id,
      countryId: item.mtCountryId,
    }));

    return { error: null, data: options };
  } catch (error) {
    return { error: getErrorMessage(error), data: null };
  }
}
