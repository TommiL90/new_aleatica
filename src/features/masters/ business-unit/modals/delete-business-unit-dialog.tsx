"use client";

import { Loader } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteBusinessUnit } from "../actions/delete-business-unit";
import type { BusinessUnitResult } from "../schemas/business-units";

interface DeleteBusinessUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessUnit: BusinessUnitResult;
  onSuccess?: () => void;
}

export function DeleteBusinessUnitDialog({
  open,
  onOpenChange,
  businessUnit,
  onSuccess,
}: DeleteBusinessUnitDialogProps) {
  const [isPending, startTransition] = React.useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteBusinessUnit(businessUnit.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Unidad ${businessUnit.name} eliminada correctamente`);
      onOpenChange(false);
      onSuccess?.();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar esta unidad de la lista? Una
            vez eliminada, no podrás recuperar los datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending && <Loader className="mr-2 size-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
