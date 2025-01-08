"use client";
import { Sheet as ISheet} from "@/app/types/sheetName";
import ButtonField from "@/components/Shared/ButtonField";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sheet() {
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [sheetName , setSheetName] = useState<string | null>(null)
  const searchParams = useParams();
  console.log(searchParams);

  const addRow = () => setRows((prev) => Math.min(prev + 1, 26));
  const addColumn = () => setColumns((prev) => Math.min(prev + 1, 100));

  const saveDataColumn = async () => {
    try {
      addColumn()
      const response = await fetch("/api/sheets/createColumn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({sheetId:searchParams.id}),
      });
      if (response.ok) {
        console.log("Column created successfully");
      } else {
        const error = await response.json();
        console.error(
          "Failed to create column:",
          error.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error creating column:", error);
    }
  };
  const saveDataRow = async () => {
    try {
      addRow()
      const response = await fetch("/api/sheets/createRow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({sheetId:searchParams.id}),
      });
      if (response.ok) {
        console.log("Row created successfully");
      } else {
        const error = await response.json();
        console.error(
          "Failed to create row:",
          error.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error creating row:", error);
    }
  };

  const getSheetById = async (id: string) => {
    try {
      const response = await fetch(`/api/sheets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data:{message :string , sheet:ISheet} = await response.json();
      if (response.ok) {
        console.log("Sheet fetched successfully");
        setSheetName(data.sheet.sheetName);
      } else {
        const error = await response.json();
        console.error("Error:", error.message || "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
   getSheetById(searchParams.id as string)
   console.log(searchParams);
  }, [])
  

  return (
    <div className="p-4 h-screen">
      <h1>{sheetName}</h1>
      <div className="border border-gray-300 rounded-lg overflow-auto h-full">
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col auto-cols-[64px]">
            <div className="w-16 bg-gray-100 border p-2"></div>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`col-${colIndex}`}
                className="relative bg-gray-200 p-2 border text-center"
              >
                <span className="font-bold">
                  {String.fromCharCode(65 + colIndex)}
                </span>
              </div>
            ))}
            <ButtonField
              title="+"
              type="button"
              style="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
              handleButtonClick={saveDataColumn}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)]">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-flow-col auto-cols-[64px]"
            >
              <div className="relative bg-gray-200 p-2 border text-center h-full">
                <span className="font-bold">{rowIndex + 1}</span>
              </div>

              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="border">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          ))}
          <ButtonField
            title="+"
            type="button"
            style="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600"
            handleButtonClick={saveDataRow}
          />
        </div>
      </div>
    </div>
  );
}
