"use client";
import ButtonField from "@/components/Shared/ButtonField";
import React, { useEffect, useState } from "react";
import { AUTHTOKEN_LOCALSTORAGE } from "../constants";
import { handleDelete } from "../utils/delete";
import CreateSheetModal from "@/components/sheets/CreateSheet";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Sheet } from "@/app/types/sheetName";

export default function Sheets() {
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [sheets, setSheets] = useState<Sheet[]>([]);

  const handleButtonClick = () => {
    setIsPopUpVisible(true);
  };

  const closePopUp = () => {
    setIsPopUpVisible(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem(AUTHTOKEN_LOCALSTORAGE);
        const response = await fetch("/api/sheets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const mappedSheets = data.userSheet.map((item: Sheet) => ({
            sheetName: item.sheetName,
            id: item.id,
          }));
          console.log(mappedSheets);

          setSheets(mappedSheets);
        } else {
          console.error("Error fetching sheets");
        }
      } catch (error) {
        console.error("Error fetching sheets:", error);
      }
    };
    fetchData();
  }, []);
  const deleteSheet = async (sheetId: string) => {
    console.log(sheetId);
    
    const response = await handleDelete(sheetId);

    if (response === "success") {
      const updatedSheets = sheets.filter(
        (sheet: Sheet) => sheet.id !== sheetId
      );

      setSheets(updatedSheets);
    } else {
      console.error("Failed to delete the sheet. Response:", response);
    }
  };

  return (
    <>
      <div className="min-h-screen p-4 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <ButtonField
            title="Create Sheet"
            style="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-[#014a6d] transition"
            handleButtonClick={handleButtonClick}
            type="button"
          />
        </div>

        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-4">Sheet Name</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sheets.length > 0 ? (
              sheets.map((sheet, index) => (
                <tr key={index} className="border-b">
                  <a href={`/sheets/${sheet.id}`}>{sheet.sheetName}</a>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <ButtonField
                        handleButtonClick={() => console.log("ay 7aga")}
                        type="button"
                        style="bg-white text-black px-4 py-2 rounded"
                        icon={<FaEdit size={20} />}
                      />
                      <ButtonField
                        type="button"
                        style="text-[#ef4444] bg-white px-4 py-2 rounded"
                        handleButtonClick={() => deleteSheet(sheet.id)}
                        icon={<FaTrash size={20} />}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="p-4 text-center text-[#e73635] font-semibold"
                >
                  No sheets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isPopUpVisible && <CreateSheetModal closePopUp={closePopUp} />}
      </div>
    </>
  );
}
