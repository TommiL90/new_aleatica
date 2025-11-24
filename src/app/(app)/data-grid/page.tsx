import { Suspense } from "react";
import { DataGridDemo } from "@/components/data-grid/data-grid-demo";
import { Shell } from "@/components/shell";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DataGridPage() {
  return (
    <Shell>
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Data Grid</h1>
        <p className="text-muted-foreground">
          Un ejemplo de tabla de datos avanzada con capacidades de edición.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="container flex h-[calc(100dvh-5rem)] flex-col gap-4 py-4">
            <div className="flex items-center gap-2 self-end">
              <Skeleton className="h-7 w-18" />
              <Skeleton className="h-7 w-18" />
              <Skeleton className="h-7 w-18" />
            </div>
            <Skeleton className="h-full w-full" />
          </div>
        }
      >
        <DataGridDemo />
      </Suspense>
    </Shell>
  );
}
