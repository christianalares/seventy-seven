'use client'

import { trpc } from '@/trpc/client'
import { Alert, AlertCancel, AlertDescription, AlertFooter, AlertTitle } from '@seventy-seven/ui/alert'
import { Button } from '@seventy-seven/ui/button'
import { DialogHeader } from '@seventy-seven/ui/dialog'
import { toast } from 'sonner'
import { popAlert } from '.'

type Props = {
  teamId: string
}

export const ConfirmLeaveTeamAlert = ({ teamId }: Props) => {
  const trpcUtils = trpc.useUtils()

  const leaveTeamMutation = trpc.teams.leave.useMutation({
    onSuccess: (leftTeam) => {
      trpcUtils.users.me.invalidate()
      trpcUtils.teams.invites.invalidate()
      trpcUtils.teams.findMany.invalidate()

      toast.success(`You have left the team ${leftTeam.team.name}`)
      popAlert('confirmLeaveTeam')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Alert>
      <DialogHeader>
        <AlertTitle>Leave team</AlertTitle>
        <AlertDescription>
          By leaving this team you will no longer have acces to this team. In order to regain access another team owner
          must invite you again.
        </AlertDescription>
      </DialogHeader>

      <p>Are you sure you want to continue?</p>

      <AlertFooter>
        <AlertCancel disabled={leaveTeamMutation.isPending}>Cancel</AlertCancel>
        <Button
          loading={leaveTeamMutation.isPending}
          variant="destructive"
          onClick={() => leaveTeamMutation.mutate({ teamId })}
        >
          Leave team
        </Button>
      </AlertFooter>
    </Alert>
  )
}
