import { NextRequest } from "next/server";
import prisma from "@/app/utils/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const sheetId = (await params).id

        if (req.method !== "POST") {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
                status: 405,
            });
        }

        const body = await req.json();
        const { cell } = body;

        if (!cell) {
            return new Response(
                JSON.stringify({ message: "Missing required field: value" }),
                { status: 400 }
            );
        }
       
        const sheetObj = await prisma.sheet.findFirst({
            where: { id: sheetId },
            include: { columns: true, rows: true, cells: true }
        });

        if (!sheetObj) {
            return new Response(JSON.stringify({ message: "Sheet does not exist" }), {
                status: 404,
            });
        }
       
        
        const cellIndex = await prisma.sheetCells.findFirst({
            where: { id: cell.id },
        });
        console.log("cellIndex:", cellIndex);
        
        const updatedCell = await prisma.sheetCells.update({
            where: { id: cell.id },
            data: {
              value: cell.value,   
            },
          });

        return new Response(
            JSON.stringify({ message: "Cell updated successfully!" ,
                cell: updatedCell,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}
