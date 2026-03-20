import prisma from "@/app/utils/prisma";
import { Sheet } from "@/app/types/sheetName";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sheetId = (await params).id;

    if (!sheetId) {
      return new Response(JSON.stringify({ message: "Sheet ID is required" }), { status: 400 });
    }

    const body = await req.json();
    const { sheet }: { sheet: Sheet } = body;

    const existingSheet = await prisma.sheet.findUnique({ where: { id: sheetId } });

    if (!existingSheet) {
      return new Response(JSON.stringify({ message: "Sheet not found" }), { status: 404 });
    }

    const updatedSheet = await prisma.sheet.update({
      where: { id: sheetId },
      data: {
        sheetName: sheet.sheetName,
      },
      include: {
        columns: true,
        rows: true,
        cells: true,
      },
    });

    return new Response(
      JSON.stringify({ message: "Sheet name updated successfully!", updatedSheet }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sheet name:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
