'use client'

import { trpc } from '@/trpc/client'
import { Button } from '@seventy-seven/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  teamId: string
}

export const AcceptInvitationButton = ({ teamId }: Props) => {
  const router = useRouter()

  const acceptInvitationMutation = trpc.invites.accept.useMutation({
    onSuccess: () => {
      toast.success('Invitation accepted')
      router.push('/account/teams')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Button loading={acceptInvitationMutation.isPending} onClick={() => acceptInvitationMutation.mutate({ teamId })}>
      Accept invitation
    </Button>
  )
}
