import { SHEET_FILE_NAME } from "@/app/constants";
import { Row , Sheet ,Cell , Column } from "../../../types/sheetName";
import { readFile } from "@/app/utils/readFile";
import { writeFile } from "@/app/utils/writeFile";
import { nanoid } from "nanoid";

export async function POST(req: Request ) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const { sheetId } = await req.json();

    if (!sheetId) {
      return new Response(
        JSON.stringify({ message: "Sheet ID is required" }),
        {
          status: 400,
        }
      );
    }

    const sheets:Sheet[] = await readFile(SHEET_FILE_NAME);
    // console.log("sheets" + JSON.stringify(sheets));
    console.log(sheets);

    
    const sheetObj = sheets.find((sheet:Sheet)=> {
      console.log(sheet);
      return sheet.id === sheetId
    });
    
    console.log("sheetObj" + sheetObj);

    if (!sheetObj) {
      return new Response(JSON.stringify({ message: "Sheet does not exist" }), {
        status: 404,
      });
    }
    
    const updatedSheets = sheets.filter((s: Sheet) => s.id !== sheetId);
    const newRowId = nanoid(); 
    const newRow : Row = {id:newRowId}
    sheetObj.rows.push(newRow)
    const newCells:Cell[] = sheetObj.columns.map((col : Column) => {
      return {
        colId:col.id,
        rowId:newRowId,
        value: "",
        // id
      };
    });
    console.log(newCells);
    sheetObj.cells.push(...newCells);
    updatedSheets.push(sheetObj);
    await writeFile(SHEET_FILE_NAME, sheets );

    return new Response(
      JSON.stringify({ message: "Row added successfully" }),
      {
        status: 200,
      }
    );
  }
   catch (error) {
    console.error("Error", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
