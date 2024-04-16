'use client'

import { createClient } from '@seventy-seven/supabase/clients/client'
import { Button } from '@seventy-seven/ui/button'

type Props = {
  returnTo?: string
}

export const SignInWithGithubButton = ({ returnTo }: Props) => {
  const sb = createClient()

  const signInWithGithub = async () => {
    const redirectTo = new URL('/api/auth/callback', window.location.origin)

    if (returnTo) {
      redirectTo.searchParams.append('return_to', returnTo)
    }

    // const redirectTo = returnTo
    //   ? `${location.origin}/api/auth/callback?returnTo=${returnTo}`
    //   : `${location.origin}/api/auth/callback`

    await sb.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // redirectTo: `${location.origin}/api/auth/callback`,
        redirectTo: redirectTo.toString(),
      },
    })
  }

  return <Button onClick={signInWithGithub}>Sign in with Github</Button>
}
