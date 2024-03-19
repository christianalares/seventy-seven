'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from './ui/button'

export const SignInWithGithubButton = () => {
  const sb = createClient()

  const signInWithGithub = async () => {
    await sb.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    })
  }

  return <Button onClick={signInWithGithub}>Sign in with Github</Button>
}
