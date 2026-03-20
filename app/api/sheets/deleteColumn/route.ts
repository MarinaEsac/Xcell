import prisma from "@/app/utils/prisma";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { colId } = body;

    if (!colId) {
      return new Response(JSON.stringify({ message: "column ID is required" }), {
        status: 400,
      });
    }

    await prisma.$transaction([
      prisma.sheetCells.deleteMany({ where: { colId } }),
      prisma.sheetColumns.delete({ where: { id: colId } }),
    ]);

    return new Response(JSON.stringify({ message: "Row deleted successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting row:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
