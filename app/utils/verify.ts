import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY!;

export async function DECODE(token: string): Promise<{ email: string } | null> {
  try {
    const decoded = jwt.verify(token, SECRET_KEY , { ignoreExpiration: true }) as { email: string };
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
    
  }
}
