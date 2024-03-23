'use client'

import { leaveTeam, setCurrentTeam } from '@/actions/teams'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Icon } from './icon'

type Props = {
  teamId: string
  isCurrent: boolean
}

export const TeamActionsMenu = ({ teamId, isCurrent }: Props) => {
  const setCurrentTeamAction = useAction(setCurrentTeam, {
    onSuccess: (updatedUser) => {
      toast.success(`Team "${updatedUser.current_team.name}" is now your current team`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  const leaveTeamAction = useAction(leaveTeam, {
    onSuccess: (updatedUser) => {
      toast.success(`You succesfully left the team "${updatedUser.team.name}"`)
    },
    onError: (err) => {
      toast.error(err.serverError)
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icon name="moreVertical" className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={isCurrent}
          onSelect={() => {
            setCurrentTeamAction.execute({
              teamId,
            })
          }}
        >
          Set as current
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={() => leaveTeamAction.execute({ teamId })}>
          Leave team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
