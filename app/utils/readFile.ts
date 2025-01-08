import path from "path";
import fs from "fs/promises";

export const readFile = async (fileName: string) => {
  try {
    const filePath = path.resolve(process.cwd(), "public", fileName);
    const fileContent = await fs.readFile(filePath, "utf8");

    const data = JSON.parse(fileContent);
    // console.log("readFile:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.log("Error" + error);
  }
};
