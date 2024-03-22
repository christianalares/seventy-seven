'use server'

import { authAction } from '@/lib/safe-action'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const createTeam = authAction(
  z.object({
    name: z.string().min(1).max(100),
  }),
  async (values) => {
    const sb = createClient()
    const res = await sb.rpc('create_team', { name: values.name })

    if (res.error) {
      throw new Error('There was an error creating the team')
    }

    revalidatePath('/account/teams')

    return res.data
  },
)
