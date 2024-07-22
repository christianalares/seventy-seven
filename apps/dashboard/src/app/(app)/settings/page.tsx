import { UpdateTeamAvatarForm } from '@/components/forms/update-team-avatar-form'
import { UpdateTeamNameForm } from '@/components/forms/update-team-name-form'
import { PageWrapper } from '@/components/page-wrapper'
import { api } from '@/queries'

const SettingsPage = async () => {
  const user = await api.users.queries.findMe()

  return (
    <PageWrapper className="space-y-4">
      <UpdateTeamNameForm
        key={user.current_team_id}
        teamId={user.current_team_id}
        defaultValues={{ name: user.current_team.name }}
      />

      <UpdateTeamAvatarForm currentTeam={user.current_team} />
    </PageWrapper>
  )
}

export default SettingsPage
