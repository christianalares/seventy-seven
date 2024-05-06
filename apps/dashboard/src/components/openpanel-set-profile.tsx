'use client'

import type { UsersFindMaybeMe } from '@/queries/users'
import { setProfile } from '@openpanel/nextjs'
import { useEffect } from 'react'

type Props = {
  user?: UsersFindMaybeMe
}

export const OpenpanelSetProfile = ({ user }: Props) => {
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
