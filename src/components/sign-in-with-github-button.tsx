'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from './ui/button'

export const SignInWithGithubButton = () => {
  const supabase = createClient()

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    })
  }

  return (
    <Button type="button" className="" onClick={signInWithGithub}>
      Sign in with Github
    </Button>
  )
}
