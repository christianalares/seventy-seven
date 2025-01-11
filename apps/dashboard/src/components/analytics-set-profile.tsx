'use client'

import type { UsersRouter } from '@/trpc/routers/users-router'
import { setProfile } from '@seventy-seven/analytics'
import { useEffect } from 'react'

type Props = {
  user: UsersRouter.GetMaybeMe
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
