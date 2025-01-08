import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getToken from './app/utils/getToken';

export async function middleware(request: NextRequest) {
  const token = await getToken(request);
  // console.log(token);
  
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }  
return NextResponse.next()
}
