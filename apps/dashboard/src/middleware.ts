import { createClient } from '@seventy-seven/supabase/clients/middleware'
import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

const OPEN_PATHS = ['/', '/closed']

export async function middleware(req: NextRequest) {
  // Get allowed IP addresses from the KV store
  const allowedIps = await get<string[]>('whitelisted-ips')

  // Redirect to /closed if the user's IP is not whitelisted
  if (
    process.env.NODE_ENV !== 'development' &&
    req.nextUrl.pathname !== '/closed' &&
    !allowedIps?.includes(req.ip ?? '')
  ) {
    return Response.redirect(new URL('/closed', req.url))
  }

  const supabase = createClient(req)
  const { data } = await supabase.auth.getUser()

  // If we're on a protected path and the user is not logged in, redirect to /
  if (!OPEN_PATHS.includes(req.nextUrl.pathname) && !data.user) {
    return Response.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
