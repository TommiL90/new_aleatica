"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState } from "react";

/**
 * QueryClientProvider para TanStack Query
 *
 * Configuración recomendada para Next.js 16:
 *
 * Revalidación automática (equivalente a SWR):
 * - refetchOnMount: true (revalidateIfStale en SWR) - Refetch si los datos están stale al montar
 * - refetchOnWindowFocus: false (revalidateOnFocus en SWR) - NO refetch al cambiar de ventana
 * - refetchOnReconnect: true (revalidateOnReconnect en SWR) - Refetch al reconectar internet
 *
 * Cache:
 * - staleTime: 60 segundos (considera los datos frescos por 60s)
 *
 * Errores:
 * - retry: 1 (reintentar una vez en caso de error)
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 60 segundos
            // Revalidación automática (equivalente a SWR)
            refetchOnMount: true, // revalidateIfStale: refetch si los datos están stale al montar
            refetchOnWindowFocus: false, // revalidateOnFocus: NO refetch al cambiar de ventana
            refetchOnReconnect: true, // revalidateOnReconnect: refetch al reconectar internet
            // Errores
            retry: 1, // Reintentar una vez en caso de error
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
