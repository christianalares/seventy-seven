'use client'

import { removeMember } from '@/actions/teams'
import { Alert, AlertCancel, AlertDescription, AlertFooter, AlertTitle } from '@seventy-seven/ui/alert'
import { Button } from '@seventy-seven/ui/button'
import { DialogHeader } from '@seventy-seven/ui/dialog'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { popAlert } from '.'

type Props = {
  teamId: string
  memberId: string
}

export const ConfirmRemoveTeamMemberAlert = ({ teamId, memberId }: Props) => {
  const pathname = usePathname()

  const action = useAction(removeMember, {
    onSuccess: (deletedUserOnTeam) => {
      toast.success(`${deletedUserOnTeam.user.full_name} was removed from the team "${deletedUserOnTeam.team.name}"`)
      popAlert('confirmRemoveTeamMember')
    },
    onError: (error) => {
      toast.error(error.serverError)
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
        <AlertCancel disabled={action.status === 'executing'}>Cancel</AlertCancel>
        <Button
          loading={action.status === 'executing'}
          variant="destructive"
          onClick={() => action.execute({ teamId, memberId, revalidatePath: pathname })}
        >
          Remove member
        </Button>
      </AlertFooter>
    </Alert>
  )
}
