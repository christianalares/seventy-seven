'use client'

import { acceptInvitation } from '@/actions/invite'
import { Button } from '@seventy-seven/ui/button'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  teamId: string
}

export const AcceptInvitationButton = ({ teamId }: Props) => {
  const router = useRouter()

  const action = useAction(acceptInvitation, {
    onSuccess: () => {
      toast.success('Invitation accepted')
      router.push('/account/teams')
    },
    onError: (err, input) => {
      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () => action.execute({ teamId: input.teamId }),
        },
      })
    },
  })

  return (
    <Button loading={action.status === 'executing'} onClick={() => action.execute({ teamId })}>
      Accept invitation
    </Button>
  )
}
