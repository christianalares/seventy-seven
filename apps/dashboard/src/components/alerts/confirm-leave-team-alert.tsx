'use client'

import { leaveTeam } from '@/actions/teams'
import { Alert, AlertCancel, AlertDescription, AlertFooter, AlertTitle } from '@seventy-seven/ui/alert'
import { Button } from '@seventy-seven/ui/button'
import { DialogHeader } from '@seventy-seven/ui/dialog'
import { useAction } from 'next-safe-action/hooks'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { popAlert } from '.'

type Props = {
  teamId: string
}

export const ConfirmLeaveTeamAlert = ({ teamId }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  const action = useAction(leaveTeam, {
    onSuccess: (leftTeam) => {
      toast.success(`You have left the team ${leftTeam.team.name}`)
      popAlert('confirmLeaveTeam')
      router.push('/account/teams')
    },
    onError: (error) => {
      toast.error(error.serverError)
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
        <AlertCancel disabled={action.status === 'executing'}>Cancel</AlertCancel>
        <Button
          loading={action.status === 'executing'}
          variant="destructive"
          onClick={() => action.execute({ revalidatePath: pathname, teamId })}
        >
          Leave team
        </Button>
      </AlertFooter>
    </Alert>
  )
}
