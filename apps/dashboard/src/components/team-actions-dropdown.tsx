'use client'

import type { UsersRouter } from '@/trpc/routers/users-router'
import { Button } from '@seventy-seven/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import { Icon } from '@seventy-seven/ui/icon'
import { Spinner } from '@seventy-seven/ui/spinner'
import { pushAlert } from './alerts'

type Props = {
  teamId: string
  userMember: UsersRouter.MyCurrentTeam['current_team']['members'][number]
  member: UsersRouter.MyCurrentTeam['current_team']['members'][number]
}

export const TeamActionsDropdown = ({ teamId, userMember, member }: Props) => {
  const isLoading = false

  const isUser = member.user.id === userMember.user.id
  const isNotUserAndIsNotOwner = !isUser && userMember.role !== 'OWNER'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading || isNotUserAndIsNotOwner}>
        <Button variant="ghost" size="icon-sm" className="gap-2">
          <span className="sr-only">Open</span>
          {isLoading ? <Spinner className="size-5" /> : <Icon name="moreHorizontal" className="size-5" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {isUser && (
          <DropdownMenuItem
            variant="destructive"
            onSelect={() =>
              pushAlert('confirmLeaveTeam', {
                teamId,
              })
            }
          >
            Leave team
          </DropdownMenuItem>
        )}

        {!isUser && userMember.role === 'OWNER' && (
          <DropdownMenuItem
            variant="destructive"
            onSelect={() =>
              pushAlert('confirmRemoveTeamMember', {
                teamId,
                memberId: member.user.id,
              })
            }
          >
            Remove member
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
