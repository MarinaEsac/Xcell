import jwt from 'jsonwebtoken';
import { IUser } from '@/app/types/user';
import { readFile } from '@/app/utils/readFile';
import { USERS_FILE_NAME } from '@/app/constants';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.SECRET_KEY!;

export async function POST(req: Request ) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
  }

  const { email, password } = await req.json();

  const data = await readFile(USERS_FILE_NAME);
  const user: IUser = data.find((u: IUser) => u.email === email);

  if (!user) {
    return new Response(JSON.stringify({ message: 'User does not exist' }), { status: 404 });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 422 });
  }

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '2 days' });



  return new Response(
    JSON.stringify({ message: 'Login successful', token }),
    { status: 200 }
  );
}
