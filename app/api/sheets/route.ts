import { SHEET_FILE_NAME } from "@/app/constants";
import { Sheet } from "@/app/types/sheetName";
import getToken from "@/app/utils/getToken";
import { readFile } from "@/app/utils/readFile";
import { DECODE } from "@/app/utils/verify";
import { writeFile } from "@/app/utils/writeFile";
import { NextRequest } from "next/server";
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
  }

  try {
    const token = await getToken(req);
    
    if (!token || typeof token !== "string") {
      return new Response(JSON.stringify({ message: "Unauthorized: Missing or invalid token" }), { status: 401 });
    }

    const decoded = await DECODE(token);

    if (!decoded || !decoded.email) {
      return new Response(JSON.stringify({ message: "Unauthorized: Invalid or expired token" }), { status: 401 });
    }

    const data = await readFile(SHEET_FILE_NAME);
    const userSheet: Sheet = data.filter((u: Sheet) => u.email === decoded.email);

    if (!userSheet) {
      return new Response(JSON.stringify({ message: "Sheets does not exist" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Sheets fetched successfuly", userSheet }), { status: 200 });
  } catch (err) {
    console.error("Error handling request:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
        status: 405,
      });
    }

    const token = await getToken(req);

    if (!token) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Invalid or missing token" }),
        { status: 401 }
      );
    }

    const decoded = await DECODE(token);

    if (!decoded || !decoded.email) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Invalid token payload" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { sheetName }: { sheetName: string } = body;

    if (!sheetName) {
      return new Response(
        JSON.stringify({ message: "Sheet name is required" }),
        { status: 400 }
      );
    }
    const sheets = await readFile(SHEET_FILE_NAME)
    const id = nanoid()
    const newSheet:Sheet = {id , email: decoded.email, sheetName , columns:[] , rows:[] , cells:[]};
    sheets.push(newSheet)
    await writeFile(SHEET_FILE_NAME , sheets); 

    return new Response(
      JSON.stringify({ message: "sheet created successfuly!", data: newSheet }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);

    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}