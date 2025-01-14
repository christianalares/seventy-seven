'use client'

import { trpc } from '@/trpc/client'
import { setProfile } from '@seventy-seven/analytics'
import { useEffect } from 'react'

export const AnalyticsSetProfile = () => {
  const { data: user } = trpc.users.maybeMe.useQuery()

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
