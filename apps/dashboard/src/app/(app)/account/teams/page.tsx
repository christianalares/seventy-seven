'use client'

import { CreateTeamButton } from '@/components/create-team-button'
import { TeamListItem } from '@/components/team-list-item'
import { trpc } from '@/trpc/client'

const AccountTeamsPage = () => {
  const [userTeams] = trpc.teams.findMany.useSuspenseQuery()

  return (
    <>
      <div className="flex justify-end">
        <CreateTeamButton />
      </div>

      {userTeams.length === 0 ? (
        <p className="mt-4">You don't belong to any team.</p>
      ) : (
        userTeams.map((userTeam) => (
          <ul key={userTeam.team.id}>
            <TeamListItem userTeam={userTeam} />
          </ul>
        ))
      )}
    </>
  )
}

export default AccountTeamsPage
