'use client'

import { changeMemberRole, removeMember } from '@/actions/teams'
import type { TEAM_ROLE_ENUM } from '@seventy-seven/orm/prisma'
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
  role: TEAM_ROLE_ENUM
}

export const ConfirmChangeYourOwnRoleAlert = ({ teamId, memberId, role }: Props) => {
  const pathname = usePathname()

  const action = useAction(changeMemberRole, {
    onSuccess: (updatedUserOnTeam) => {
      toast.success(`Role for ${updatedUserOnTeam.user.full_name} changed to ${updatedUserOnTeam.role.toLowerCase()}`)
      popAlert('confirmChangeYourOwnRole')
    },
    onError: (error) => {
      toast.error(error.serverError)
    },
  })

  return (
    <Alert>
      <DialogHeader>
        <AlertTitle>Change your own role</AlertTitle>
        <AlertDescription>
          You are about to change your own role. If you proceed you won't be able to change it back, someone with a
          higher role will have to change it for you.
        </AlertDescription>
      </DialogHeader>

      <p>Are you sure you want to continue?</p>

      <AlertFooter>
        <AlertCancel disabled={action.status === 'executing'}>Cancel</AlertCancel>
        <Button
          loading={action.status === 'executing'}
          variant="destructive"
          onClick={() => {
            action.execute({
              revalidatePath: pathname,
              memberId: memberId,
              teamId,
              role,
            })
          }}
        >
          Change role
        </Button>
      </AlertFooter>
    </Alert>
  )
}
