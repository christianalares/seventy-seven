'use client'

import { trpc } from '@/trpc/client'
import type { UsersRouter } from '@/trpc/routers/users-router'
import { getRoleName } from '@/utils/get-role-name'
import { TEAM_ROLE_ENUM } from '@seventy-seven/orm/enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@seventy-seven/ui/select'
import { toast } from 'sonner'
import { pushAlert } from './alerts'

type Props = {
  userId: string
  teamId: string
  member: UsersRouter.MyCurrentTeam['current_team']['members'][number]
  isUserTheLastOwner: boolean
}

export const TeamRoleSelect = ({ userId, teamId, member, isUserTheLastOwner }: Props) => {
  const trpcUtils = trpc.useUtils()

  const changeMemberRoleMutation = trpc.teams.changeMemberRole.useMutation({
    onSuccess: (updatedUserOnTeam) => {
      trpcUtils.users.myCurrentTeam.invalidate()

      toast.success(`Role for ${updatedUserOnTeam.user.full_name} changed to ${updatedUserOnTeam.role.toLowerCase()}`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onValueChange = (role: TEAM_ROLE_ENUM) => {
    // Do nothing if you select the same role as the current role
    if (role === member.role) {
      return
    }

    if (isUserTheLastOwner && userId === member.user.id) {
      pushAlert('prohibitLastOwnerRoleChange')
      return
    }

    // If you are trying to change your own role to `MEMBER`, show a confirmation alert
    if (member.user.id === userId && role === 'MEMBER') {
      pushAlert('confirmChangeYourOwnRole', {
        memberId: member.user.id,
        role,
        teamId,
      })

      return
    }

    changeMemberRoleMutation.mutate({
      memberId: member.user.id,
      teamId,
      role,
    })
  }

  return (
    <Select value={member.role} disabled={changeMemberRoleMutation.isPending} onValueChange={onValueChange}>
      <SelectTrigger className="w-28 h-8">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>

      <SelectContent>
        {Object.values(TEAM_ROLE_ENUM).map((role) => (
          <SelectItem key={role} value={role}>
            {getRoleName(role)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
