import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY!;

  export default async function getToken(
    req: NextRequest
  ): Promise<string | null> {

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Unauthorized: Missing or malformed Authorization header");
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    throw new Error("Unauthorized: Token is null or undefined");
  }

  const decoded = jwt.verify(token, SECRET_KEY);

  if (decoded === jwt.TokenExpiredError) {
    throw new Error("Unauthorized: Missing token??");
  }
  return token;
  
};

