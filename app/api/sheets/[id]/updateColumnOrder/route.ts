import { NextRequest } from "next/server";
import prisma from "@/app/utils/prisma";
import { IColumn } from "@/app/types/sheetName";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const sheetId = (await params).id;

        if (req.method !== "POST") {
            return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
        }

        const body = await req.json();
        const { columns }: { columns: IColumn[] } = body;

        if (!columns) {
            return new Response(
                JSON.stringify({ message: "Missing required field: columnId" }),
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
      
        const updateColumns = await Promise.all(
            columns.map((col) =>
              prisma.sheetColumns.update({
                where: { id: col.id },
                data: {
                  name: col.name,
                  order: col.order as number,
                },
              })
            )
          );
          

        console.log("Updated Columns: ", updateColumns);
       
        const updatedSheet = await prisma.sheet.findUnique({
            where: { id: sheetId },
            include: {
                columns: true,
                cells: true,
            },
        });
        if (!updatedSheet) {
            return new Response(JSON.stringify({ message: "Failed to fetch updated sheet" }), {
                status: 500,
            });
        }
        const columnsWithCells = updatedSheet.columns.map((col) => ({
            ...col,
            cells: updatedSheet.cells.filter((cell) => cell.colId === col.id),
        }));
        return new Response(
            JSON.stringify({
                message: "Updated successfully!",
                columns: columnsWithCells,
            }),
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof Error) { console.log("Error: ", error.stack) }

        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}


