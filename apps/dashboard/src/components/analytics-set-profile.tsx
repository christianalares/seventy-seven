'use client'

import type { UsersFindMaybeMe } from '@/queries/users'
import { setProfile } from '@seventy-seven/analytics'
import { useEffect } from 'react'

type Props = {
  user?: UsersFindMaybeMe
}

export const AnalyticsSetProfile = ({ user }: Props) => {
  useEffect(() => {
    if (!user) {
      return
    }

    setProfile({
      profileId: user.id,
      firstName: user.full_name,
      email: user.email,
      avatar: user.image_url ?? undefined,
    })
  }, [user])

  return null
}
