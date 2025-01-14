import { analyticsClient } from '@/lib/analytics'
import { trpc } from '@/trpc/server'
import { createClient } from '@seventy-seven/supabase/clients/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  const returnTo = requestUrl.searchParams.get('return_to')

  if (code) {
    const sb = createClient()
    await sb.auth.exchangeCodeForSession(code)

    const user = await trpc.users.me()

    analyticsClient.event('login', {
      email: user.email,
      full_name: user.full_name,
      profileId: user.id,
    })
  }

  if (returnTo) {
    return NextResponse.redirect(`${origin}/${returnTo}`)
  }

  return NextResponse.redirect(origin)
}
