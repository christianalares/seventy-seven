import { UpdateTeamAvatarForm } from '@/components/forms/update-team-avatar-form'
import { UpdateTeamNameForm } from '@/components/forms/update-team-name-form'
import { PageWrapper } from '@/components/page-wrapper'

const SettingsPage = () => {
  return (
    <PageWrapper className="space-y-4">
      <UpdateTeamNameForm />
      <UpdateTeamAvatarForm />
    </PageWrapper>
  )
}

export default SettingsPage
