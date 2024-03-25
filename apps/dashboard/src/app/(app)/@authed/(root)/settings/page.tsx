import { UpdateTeamNameForm } from '@/components/forms/update-team-name.form'
import { PageWrapper } from '@/components/page-wrapper'
import { getUser } from '@/utils/supabase/session'

const SettingsPage = async () => {
  const user = await getUser()

  return (
    <PageWrapper>
      <UpdateTeamNameForm teamId={user.current_team_id} defaultValues={{ name: user.current_team.name }} />
    </PageWrapper>
  )
}

export default SettingsPage
