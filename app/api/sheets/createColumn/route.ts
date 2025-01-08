import { Cell, Column, Sheet } from "./../../../types/sheetName";
import { readFile } from "./../../../utils/readFile";
import { writeFile } from "./../../../utils/writeFile";
import { nanoid } from "nanoid";
import { SHEET_FILE_NAME } from './../../../constants';

export async function POST(req: Request) {
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

    const sheets: Sheet[] = await readFile(SHEET_FILE_NAME);

    const sheetObj = sheets.find((sheet: { id: string }) => sheet.id === sheetId);
    // let sheetObj:Sheet | null = null;
    // for(let i=0 ; i<sheets.length ; i++){
    //   const sheet = sheets[i]
    //   console.log(sheet , i);
    //   if(sheet.sheetName === sheetName) {
    //    sheetObj=sheets[i]
    //    return;
    //   }    
    // }    

    if (!sheetObj) {
      return new Response(JSON.stringify({ message: "Sheet does not exist" }), {
        status: 404,
      });
    }
    const updatedSheets = sheets.filter((s: Sheet) => s.id !== sheetId);
    const newColumnId = nanoid();
    const newColumn: Column = { id: newColumnId, name: `column ${sheetObj.columns.length + 1}` }
    const rowIds = sheetObj.rows?.map((row: { id: string }) => row.id) || [];
    sheetObj.columns.push(newColumn)
    const newCells: Cell[] = rowIds.map((rowId: string) => {
      return {
        colId: newColumnId,
        rowId,
        value: "",
      };
    });
    console.log(newCells);
    sheetObj.cells.push(...newCells);
    updatedSheets.push(sheetObj);
    await writeFile(SHEET_FILE_NAME, sheets);

    return new Response(
      JSON.stringify({ message: "Column added successfully" }),
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