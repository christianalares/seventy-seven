import { createClient } from '@seventy-seven/supabase/clients/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  const returnTo = requestUrl.searchParams.get('return_to')
  console.log(1111, returnTo)

  if (code) {
    const sb = createClient()
    await sb.auth.exchangeCodeForSession(code)
  }

  // if (returnTo) {
  //   return NextResponse.redirect(`${origin}/${returnTo}`)
  // }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(origin)
}
