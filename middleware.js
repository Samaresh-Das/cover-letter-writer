import { NextResponse } from 'next/server';

// Routes that should redirect to /dashboard if user is already logged in
const AUTH_ROUTES = ['/', '/auth'];

// Routes that require a token; redirect to /auth if missing
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/onboarding'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // If user is authenticated and trying to visit landing or auth page → go to dashboard
  if (token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is NOT authenticated and trying to visit a protected route → go to auth
  if (!token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-next-pathname', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
