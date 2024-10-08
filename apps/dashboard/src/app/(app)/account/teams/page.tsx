import { CreateTeamButton } from '@/components/create-team-button'
import { PageWrapper } from '@/components/page-wrapper'
import { TeamListItem } from '@/components/team-list-item'
import { api } from '@/queries'

const AccountTeamsPage = async () => {
  const userTeams = await api.teams.queries.findMany()

  return (
    <PageWrapper>
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
    </PageWrapper>
  )
}

export default AccountTeamsPage
