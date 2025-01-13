'use client'

import { trpc } from '@/trpc/client'
import type { TEAM_ROLE_ENUM } from '@seventy-seven/orm/enums'
import { Alert, AlertCancel, AlertDescription, AlertFooter, AlertTitle } from '@seventy-seven/ui/alert'
import { Button } from '@seventy-seven/ui/button'
import { DialogHeader } from '@seventy-seven/ui/dialog'
import { toast } from 'sonner'
import { popAlert } from '.'

type Props = {
  teamId: string
  memberId: string
  role: TEAM_ROLE_ENUM
}

export const ConfirmChangeYourOwnRoleAlert = ({ teamId, memberId, role }: Props) => {
  const trpcUtils = trpc.useUtils()

  const changeMemberRoleMutation = trpc.teams.changeMemberRole.useMutation({
    onSuccess: (updatedUserOnTeam) => {
      trpcUtils.users.myCurrentTeam.invalidate()

      toast.success(`Role for ${updatedUserOnTeam.user.full_name} changed to ${updatedUserOnTeam.role.toLowerCase()}`)
      popAlert('confirmChangeYourOwnRole')
    },
    onError: (error) => {
      toast.error(error.message)
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
        <AlertCancel disabled={changeMemberRoleMutation.isPending}>Cancel</AlertCancel>
        <Button
          loading={changeMemberRoleMutation.isPending}
          variant="destructive"
          onClick={() => {
            changeMemberRoleMutation.mutate({
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
