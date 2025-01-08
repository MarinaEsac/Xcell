import { SHEET_FILE_NAME } from "@/app/constants";
import { Sheet } from "@/app/types/sheetName";
import { readFile } from "@/app/utils/readFile";
import { writeFile } from "@/app/utils/writeFile";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    // const url = new URL(req.url);
    // const sheetName = url.searchParams.get("sheetName")

    const sheetId = (await params).id

    if (!sheetId) {
      return new Response(
        JSON.stringify({ message: "This sheet is not found" }),
        {
          status: 400,
        }
      );
    }

    const sheets = await readFile(SHEET_FILE_NAME);

    const sheet = sheets.find((sheet: { id: string }) => sheet.id === sheetId);

    if (!sheet) {
      return new Response(JSON.stringify({ message: "Sheet does not exist" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Sheet fetched successfully" , sheet }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (req.method !== "DELETE") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }

  try {
    const sheetId = (await params).id
    console.log(sheetId);
    console.log(params);
    
    if (!sheetId) {
      return new Response(
        JSON.stringify({ message: "Sheet name is required" }),
        {
          status: 400,
        }
      );
    }

    const sheets = await readFile(SHEET_FILE_NAME);

    const file = sheets.find(
      (sheet: { id: string }) =>
        sheet.id !== sheetId
    );
    if (file == undefined) {
      await writeFile(SHEET_FILE_NAME, []);

      return new Response(
        JSON.stringify({ message: "Sheet deleted successfully" }),
        {
          status: 200,
        }
      );
    }
    // console.log(file);
    if (!file) {
      return new Response(JSON.stringify({ message: "not_found" }), {
        status: 404,
      });
    }

    const updatedSheets = sheets.filter(
      (sheet: Sheet) =>
        sheet.id !== sheetId
    );

    const response = await writeFile(SHEET_FILE_NAME, updatedSheets);
    if (!response.status) {
      return NextResponse.json({ message: response.message }, { status: 422 });
    }

    return new Response(
      JSON.stringify({ message: "Sheet deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting sheet:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
