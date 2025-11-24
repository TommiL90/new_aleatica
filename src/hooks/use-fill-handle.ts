import * as React from "react";
import type { CellPosition, CellRange, FillEvent } from "@/types/data-grid";

interface UseFillHandleProps {
  onFill?: (event: FillEvent) => void;
  disabled?: boolean;
}

export function useFillHandle({ onFill, disabled }: UseFillHandleProps) {
  const [fillStart, setFillStart] = React.useState<CellPosition | null>(null);
  const [fillEnd, setFillEnd] = React.useState<CellPosition | null>(null);
  const [isFilling, setIsFilling] = React.useState(false);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent, rowIndex: number, columnId: string) => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      
      setFillStart({ rowIndex, columnId });
      setFillEnd({ rowIndex, columnId });
      setIsFilling(true);
      
      document.body.style.cursor = "crosshair";
      document.body.style.userSelect = "none";
    },
    [disabled]
  );

  const onMouseEnter = React.useCallback(
    (rowIndex: number, columnId: string) => {
      if (!isFilling || !fillStart) return;
      
      setFillEnd({ rowIndex, columnId });
    },
    [isFilling, fillStart]
  );

  const onMouseUp = React.useCallback(() => {
    if (!isFilling || !fillStart || !fillEnd || !onFill) {
      setIsFilling(false);
      setFillStart(null);
      setFillEnd(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      return;
    }

    // Calculate source and target ranges
    // For simplicity, we assume the source is the start cell (or the selection if we had access to it, 
    // but here we just know where the handle was clicked).
    // Actually, usually the handle is on the selection. 
    // Let's assume the start cell IS the source range (single cell) for now, 
    // or the consumer needs to handle multi-cell source.
    
    // In the user's reference, they pass start/end indices.
    // We will construct a range.
    
    const minRow = Math.min(fillStart.rowIndex, fillEnd.rowIndex);
    const maxRow = Math.max(fillStart.rowIndex, fillEnd.rowIndex);
    
    // We only support vertical fill for now based on user's "vertical" comment,
    // but let's support both or restrict based on direction.
    // The user's reference seems to handle sub-rows which implies verticality.
    
    // Let's determine direction like before
    const rowDiff = Math.abs(fillEnd.rowIndex - fillStart.rowIndex);
    // We can't easily check column index difference without column order, 
    // but if columnId is the same, it's vertical.
    
    let targetRange: CellRange;
    
    if (fillStart.columnId === fillEnd.columnId) {
      // Vertical fill
      targetRange = {
        start: { rowIndex: minRow, columnId: fillStart.columnId },
        end: { rowIndex: maxRow, columnId: fillStart.columnId }
      };
    } else {
      // Horizontal or Rectangular fill
      // Since we don't have column indices here easily, we just pass the start/end column IDs
      // and let the consumer handle the range logic (finding indices).
      targetRange = {
        start: fillStart,
        end: fillEnd
      };
    }
    
    // Source range: strictly speaking, the fill handle is usually dragged FROM a selection.
    // But here we only captured the start cell of the drag.
    // We'll define sourceRange as the start cell.
    const sourceRange: CellRange = {
      start: fillStart,
      end: fillStart
    };

    onFill({ sourceRange, targetRange });

    setIsFilling(false);
    setFillStart(null);
    setFillEnd(null);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [isFilling, fillStart, fillEnd, onFill]);

  // Add global mouse up listener to catch releases outside the grid
  React.useEffect(() => {
    if (isFilling) {
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [isFilling, onMouseUp]);

  return {
    fillStart,
    fillEnd,
    isFilling,
    onMouseDown,
    onMouseEnter,
  };
}
