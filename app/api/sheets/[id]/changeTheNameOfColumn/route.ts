import { NextRequest } from "next/server";
import { IColumn } from "@/app/types/sheetName";
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
        const { column }: { column: IColumn } = body;

        if (!column) {
            return new Response(
                JSON.stringify({ message: "Missing required field: Name of column" }),
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

        const columnIndex = await prisma.sheetColumns.findFirst({
            where: { id: column.id },
        });
        console.log("columnIndex : ", columnIndex);

        const updatedColumn = await prisma.sheetColumns.update({
            where: { id: column.id },
            data: {
                name: column.name,
            },
        });
        console.log("Updated Column: ", updatedColumn);

        const updatedSheet = await prisma.sheet.findUnique({
            where: { id: sheetId },
            include: {
                columns: true,
                cells: true,
                rows: true,
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
            JSON.stringify({ message: "Column name updated successfully!", columns: columnsWithCells }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}

