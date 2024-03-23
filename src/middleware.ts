import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const allowedIps = await get<string[]>('whitelisted-ips')

  // Redirect to /closed if the user is not allowed to access the site
  if (
    process.env.NODE_ENV !== 'development' &&
    req.nextUrl.pathname !== '/closed' &&
    !allowedIps?.includes(req.ip ?? '')
  ) {
    return Response.redirect(new URL('/closed', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
