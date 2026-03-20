import React, { useCallback, useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import SharedCell from "@/components/Shared/SharedCell";
import { handleColumnName } from "@/app/utils/columnName";
import { ExtendedColumn } from "@/app/sheets/[id]/page";
import { Debounce } from "@/app/utils/debounce";

type SharedColumnProps = {
  column: ExtendedColumn;
  index: number;
  sheetId: string;
  allColumns: ExtendedColumn[];
  onChange: (updatedColumns: ExtendedColumn[]) => void;
};

export function Column({
  column,
  sheetId,
  allColumns,
  onChange,
}: SharedColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tempName, setTempName] = useState(column.name); 

  const handleUpdatedColumn = async (updatedColumnName: string) => {
    try {
      const updatedColumn = { ...column, name: updatedColumnName };
      const result = await handleColumnName(sheetId, updatedColumn);
      if (result.message === "success") {
        onChange(result.columns!);
      } else {
        console.error("Error updating column:", result);
      }
    } catch (error) {
      console.error("Error in handleUpdatedColumn:", error);
    }
  };

  const debouncedHandleUpdate = useCallback(
    Debounce((name: string) => handleUpdatedColumn(name), 2000),
    []
  );

  const handleBlur = () => {
    setIsEditing(false);
    handleUpdatedColumn(tempName); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); 
    }
  };

  const deleteColumn = async (colId: string) => {
    try {
      const response = await fetch("/api/sheets/deleteColumn", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ colId }),
      });

      const data = await response.json();

      if (response.ok) {
        const filteredColumns = allColumns
          .filter((col) => col.id !== colId)
          .map((col) => ({
            ...col,
            cells: col.cells?.filter((cell) => cell.colId !== colId),
          }));

        onChange(filteredColumns);
      } else {
        console.error("Failed to delete column:", data.message);
      }
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  return (
    <div key={column.id} className="w-40 relative">
      <div className="w-full">
        <div
          className="relative bg-gray-200 p-2 border text-center h-10 w-full"
          onPointerDown={(e) => {
            if (isEditing) e.stopPropagation();
          }}
        >
          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => {
                setTempName(e.target.value);
                const newValue = e.target.value;
                debouncedHandleUpdate(newValue);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex justify-between items-center">
              <span className="flex-1 text-center">{column.name}</span>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-gray-400 hover:text-black p-1"
                >
                  <FiMoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div className="absolute top-5 right-3 mt-1 w-15 bg-slate-50 border rounded shadow-xl z-10">
                    <button
                      onClick={() => {
                        deleteColumn(column.id);
                        setMenuOpen(false);
                      }}
                      className="text-center px-3 py-1 text-black hover:text-red-700 w-full"
                    >
                      Delete
                    </button>
                    <hr className="border-t border-gray-400" />
                    <button
                      onClick={() => {
                        setTempName(column.name); 
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                      className="text-center px-3 py-1 text-black hover:text-blue-600 w-full"
                    >
                      Rename
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {column.cells?.map((cell, index) => (
          <SharedCell key={index} cell={cell} sheetId={sheetId!} />
        ))}
      </div>
    </div>
  );
}
