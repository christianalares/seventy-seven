import { createClient } from '@seventy-seven/supabase/clients/middleware'
import { type NextRequest, NextResponse } from 'next/server'

const OPEN_PATHS = ['/closed']

export async function middleware(req: NextRequest) {
  const isProtectedRoute = !OPEN_PATHS.includes(req.nextUrl.pathname)
  const isHomePage = req.nextUrl.pathname === '/'

  const supabase = createClient(req)
  const { data } = await supabase.auth.getUser()

  if (isProtectedRoute) {
    if (data.user) {
      return NextResponse.next()
    }

    if (!isHomePage) {
      return Response.redirect(new URL(`/?return_to=${req.nextUrl.pathname}`, req.url))
    }
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
    '/((?!api|_next/static|_next/image|favicon.ico|opengraph-image.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
