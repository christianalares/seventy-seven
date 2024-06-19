'use client'

import { changeMemberRole } from '@/actions/teams'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { getRoleName } from '@/utils/get-role-name'
import { TEAM_ROLE_ENUM } from '@seventy-seven/orm/enums'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@seventy-seven/ui/select'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { pushAlert } from './alerts'

type Props = {
  userId: string
  teamId: string
  member: UsersGetMyCurrentTeam['current_team']['members'][number]
  isUserTheLastOwner: boolean
}

export const TeamRoleSelect = ({ userId, teamId, member, isUserTheLastOwner }: Props) => {
  const pathname = usePathname()

  const action = useAction(changeMemberRole, {
    onSuccess: (updatedUserOnTeam) => {
      toast.success(`Role for ${updatedUserOnTeam.user.full_name} changed to ${updatedUserOnTeam.role.toLowerCase()}`)
    },
    onError: (error) => {
      toast.error(error.serverError)
    },
  })

  const onValueChange = (role: TEAM_ROLE_ENUM) => {
    // Do nothing if you select the same role as the current role
    if (role === member.role) {
      return
    }

    if (isUserTheLastOwner) {
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

    action.execute({
      revalidatePath: pathname,
      memberId: member.user.id,
      teamId,
      role,
    })
  }

  return (
    <Select value={member.role} disabled={action.status === 'executing'} onValueChange={onValueChange}>
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
