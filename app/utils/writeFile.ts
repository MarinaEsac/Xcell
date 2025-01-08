import path from "path";
import fs from "fs/promises";

export const writeFile = async (
  fileName: string,
  content: unknown
): Promise<{ status: boolean; message?: string }> => {
  try {
    // console.log("content:" + content.sheetName);
    const filePath = path.resolve(process.cwd(), "public", fileName);
    let fileContent = await fs.readFile(filePath, "utf-8");
    await fs.writeFile(filePath, JSON.stringify(content), "utf-8");
    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
      message: `An error occurred while writing the file: ${fileName}`,
    };
  }
};
