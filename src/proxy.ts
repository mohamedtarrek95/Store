import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const EXPECTED_COOKIE_NAME = 'authjs.session-token';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const rawCookie = req.headers.get('cookie') || '';
    const hasCookie = rawCookie.includes(EXPECTED_COOKIE_NAME);
    const allCookieNames = rawCookie.split(';').map(c => c.split('=')[0]?.trim()).filter(Boolean);

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: false,
      cookieName: EXPECTED_COOKIE_NAME,
    });

    console.log('[PROXY] pathname:', pathname);
    console.log('[PROXY] has authjs.session-token cookie:', hasCookie);
    console.log('[PROXY] all cookie names:', allCookieNames);
    console.log('[PROXY] token found:', !!token);
    if (token) {
      console.log('[PROXY] token.isAdmin:', token.isAdmin);
    }

    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      console.log('[PROXY] redirecting to:', loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }

    if (!token.isAdmin) {
      console.log('[PROXY] forbidden - not admin');
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    console.log('[PROXY] access granted');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};