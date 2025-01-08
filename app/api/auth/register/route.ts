import bcrypt from "bcryptjs";
import { IUser } from "@/app/types/user";
import { readFile } from "@/app/utils/readFile";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { writeFile } from "@/app/utils/writeFile";
import { USERS_FILE_NAME } from "@/app/constants";

const SECRET_KEY = process.env.SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const { username, email, password }: IUser = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const users = await readFile(USERS_FILE_NAME);
    const user: IUser = users.find((u: IUser) => u.email === email);
    if (user) {
      return NextResponse.json({ message: "Email already exists" }, { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = { username, email, password: hashedPassword }
    users.push(newUser)
    const writeFileResponse = await writeFile (USERS_FILE_NAME , users)

    if(!writeFileResponse.status){
      return NextResponse.json({ message: writeFileResponse.message }, { status: 422 });
    }
    const token = jwt.sign({ email }, SECRET_KEY, {
      expiresIn: "2 days",
    });
    const response = NextResponse.json(
      { message: "User registered successfully!" , token },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

