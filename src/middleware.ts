import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'recura_session';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!cookie?.value) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
      // Base64 decode in a universally safe way (Edge runtime compatible)
      const decoded = atob(cookie.value);
      const session = JSON.parse(decoded);

      if (!session || !session.userId) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
