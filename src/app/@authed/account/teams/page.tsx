import { CreateTeamButton } from '@/components/create-team-button'
import { PageWrapper } from '@/components/page-wrapper'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { getSessionOrThrow } from '@/utils/supabase/session'
import { teamRoleEnumToWord } from '@/utils/teamRoleEnumToWord'

const AccountTeamsPage = async () => {
  const sb = createClient()
  const session = await getSessionOrThrow()

  const { data: userTeams } = await sb
    .from('users_on_teams')
    .select(`
    role,
    team:teams(*)
  `)
    .eq('user_id', session.user.id)
    .throwOnError()

  if (!userTeams) {
    return <p>There are no current teams</p>
  }

  return (
    <PageWrapper>
      <CreateTeamButton />

      {userTeams.map((userTeam) => (
        <div key={userTeam.team?.id} className="mt-4 flex items-center justify-between p-4 rounded-md border">
          <div>
            <h2>{userTeam.team?.name}</h2>
            <p className="text-sm text-muted-foreground">{teamRoleEnumToWord(userTeam.role)}</p>
          </div>

          <div>
            <Button size="sm" variant="outline">
              Manage
            </Button>
          </div>
        </div>
      ))}
    </PageWrapper>
  )
}

export default AccountTeamsPage
