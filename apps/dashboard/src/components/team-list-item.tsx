'use client'

import type { TeamsRouter } from '@/trpc/routers/teams-router'
import { teamRoleEnumToWord } from '@/utils/teamRoleEnumToWord'
import { TeamActionsMenu } from './team-actions-menu'

type Props = {
  userTeam: TeamsRouter.FindMany[number]
}

export const TeamListItem = ({ userTeam }: Props) => {
  return (
    <div key={userTeam.team.id} className="mt-4 flex items-center justify-between p-4 rounded-md border">
      <div>
        <h2 className="flex items-center gap-4">
          {userTeam.team.name}
          {userTeam.team.is_personal && (
            <span className="text-xs border py-1 px-2 rounded-sm text-muted-foreground">Personal</span>
          )}
        </h2>
        <p className="text-sm text-muted-foreground">{teamRoleEnumToWord(userTeam.role)}</p>
      </div>

      <div className="flex items-center gap-4">
        {userTeam.isCurrent && <p className="text-muted-foreground text-sm">Current</p>}

        <TeamActionsMenu teamId={userTeam.team.id} isCurrent={userTeam.isCurrent} />
      </div>
    </div>
  )
}
