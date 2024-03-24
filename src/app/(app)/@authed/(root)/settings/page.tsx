import { UpdateTeamNameForm } from '@/components/forms/update-team-name.form'
import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/utils/supabase/queries/users'

const SettingsPage = async () => {
  const user = await usersQueries.me()

  return (
    <PageWrapper>
      <UpdateTeamNameForm teamId={user.current_team_id} defaultValues={{ name: user.current_team.name }} />
    </PageWrapper>
  )
}

export default SettingsPage
