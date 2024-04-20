'use client'

import { createClient } from '@seventy-seven/supabase/clients/client'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'

type Props = {
  returnTo?: string
}

export const SignInWithGithubButton = ({ returnTo }: Props) => {
  const sb = createClient()

  const signIn = async () => {
    const redirectTo = new URL('/api/auth/callback', window.location.origin)

    if (returnTo) {
      redirectTo.searchParams.append('return_to', returnTo)
    }

    await sb.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectTo.toString(),
      },
    })
  }

  return (
    <Button onClick={signIn} className="gap-2 w-full">
      <Icon name="github" />
      Sign in with Github
    </Button>
  )
}
