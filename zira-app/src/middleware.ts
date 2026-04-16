import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next.js middleware runs on every matched request.
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session so it never expires silently.
 * 2. Protect /app/* — redirect unauthenticated users to /login.
 * 3. Redirect authenticated users away from /login and /register to /dashboard.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Refresh session ──────────────────────────────────────────────────────
  const { supabaseResponse, user } = await updateSession(request);

  // ── 2. Protect /app/* routes ────────────────────────────────────────────────
  const isAppRoute = pathname.startsWith('/app');
  if (isAppRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Redirect authenticated users away from auth pages ────────────────────
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  if (isAuthPage && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/app/dashboard';
    dashboardUrl.search = '';
    return NextResponse.redirect(dashboardUrl);
  }

  // ── 4. Pass through with (possibly refreshed) session cookies ───────────────
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico   (favicon)
     * - Public assets: svg, png, jpg, jpeg, gif, webp, ico, mp4, mp3, pdf
     * - API routes that should be unauthenticated (e.g. webhooks)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3|pdf)$).*)',
  ],
};
