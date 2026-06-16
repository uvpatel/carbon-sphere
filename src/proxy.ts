import { NextRequest, NextResponse } from 'next/server'

// Protected paths that require authentication
const PROTECTED_PATHS = ['/dashboard', '/calculator', '/coach', '/simulator']
// Auth paths that should redirect to dashboard if already logged in
const AUTH_PATHS = ['/login', '/register']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session cookie
  const sessionCookie = request.cookies.get('carbonsphere-session')
  const isLoggedIn = !!sessionCookie?.value

  // 1. If accessing a protected path and NOT logged in, redirect to login
  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path))
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    // Save original path as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If logged in and accessing login/register/root, redirect to dashboard
  const isAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path)) || pathname === '/'
  if (isLoggedIn && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow request to proceed
  return NextResponse.next()
}

// Next.js 16 Config for proxy routing paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
