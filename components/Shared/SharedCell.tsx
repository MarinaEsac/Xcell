"use client"
import { Cell } from "@/app/types/sheetName";
import { handleValue } from "@/app/utils/cell";
import React, { useCallback } from "react";
import { Debounce } from "@/app/utils/debounce";

type SharedCellProps = {
  cell: Cell;
  sheetId: string;
};

export default function SharedCell({ cell, sheetId }: SharedCellProps) {

  const handleUpdatedCell = async (updatedValue: string) => {
    try {      
      const updatedCell = { ...cell, value: updatedValue };
      const result = await handleValue(sheetId, updatedCell);

      if (result === "success") {
        console.log("SUCCESS");
      } else {
        console.error("Error updating cell:", result);
      }
    } catch (error) {
      console.error("Error in handleUpdatedCell:", error);
    }    
  };



  const debouncedHandleUpdate = useCallback(
    Debounce((value: string) => handleUpdatedCell(value), 500),
    []
  );
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.stopPropagation(); 
    }
  };

  return (
    <div onPointerDown={(e) => e.stopPropagation()} className="border">
      <input
        type="text"
        className="h-14 w-full border border-gray-300 rounded"
        defaultValue={cell.value} 
        onChange={(e) => {
          const newValue = e.target.value;
          debouncedHandleUpdate(newValue);
        }}
        onKeyDown={handleKeyDown} 
      />
    </div>
  );
}