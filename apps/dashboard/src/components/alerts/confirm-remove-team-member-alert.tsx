'use client'

import { trpc } from '@/trpc/client'
import { Alert, AlertCancel, AlertDescription, AlertFooter, AlertTitle } from '@seventy-seven/ui/alert'
import { Button } from '@seventy-seven/ui/button'
import { DialogHeader } from '@seventy-seven/ui/dialog'
import { toast } from 'sonner'
import { popAlert } from '.'

type Props = {
  teamId: string
  memberId: string
}

export const ConfirmRemoveTeamMemberAlert = ({ teamId, memberId }: Props) => {
  const trpcUtils = trpc.useUtils()

  const removeMemberMutation = trpc.teams.removeMember.useMutation({
    onSuccess: (deletedUserOnTeam) => {
      trpcUtils.users.myCurrentTeam.invalidate()

      toast.success(`${deletedUserOnTeam.user.full_name} was removed from the team "${deletedUserOnTeam.team.name}"`)
      popAlert('confirmRemoveTeamMember')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Alert>
      <DialogHeader>
        <AlertTitle>Remove member</AlertTitle>
        <AlertDescription>
          You are about to remove a member from the team. This action cannot be undone.
        </AlertDescription>
      </DialogHeader>

      <p>Are you sure you want to continue?</p>

      <AlertFooter>
        <AlertCancel disabled={removeMemberMutation.isPending}>Cancel</AlertCancel>
        <Button
          loading={removeMemberMutation.isPending}
          variant="destructive"
          onClick={() => removeMemberMutation.mutate({ teamId, memberId })}
        >
          Remove member
        </Button>
      </AlertFooter>
    </Alert>
  )
}
