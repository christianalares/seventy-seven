import { get } from '@vercel/edge-config'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const allowedIps = await get<string[]>('whitelisted-ips')

  if (process.env.NODE_ENV !== 'development' && allowedIps?.includes(req.ip ?? '')) {
    return Response.redirect(new URL('/closed', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|closed).*)'],
}
