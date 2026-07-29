import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('[PROXY] pathname:', pathname);
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