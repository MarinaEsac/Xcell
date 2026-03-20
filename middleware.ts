import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const secret =
    process.env.NEXTAUTH_SECRET ?? process.env.SECRET_KEY ?? undefined;
  const token = await getToken({ req: request, secret });
  const isAuth = !!token;

  // `middleware` is configured with a matcher that only targets protected pages,
  // so every matched request is considered protected.
  if (!isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Run middleware only on protected pages (never on /api/auth/* or OAuth callbacks).
export const config = {
  matcher: ["/sheets/:path*", "/dashboard/:path*", "/profile/:path*"],
};
