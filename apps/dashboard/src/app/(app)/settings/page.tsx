import { UpdateTeamAvatarForm } from '@/components/forms/update-team-avatar-form'
import { UpdateTeamNameForm } from '@/components/forms/update-team-name-form'
import { PageWrapper } from '@/components/page-wrapper'
import { HydrateClient, trpc } from '@/trpc/server'

const SettingsPage = () => {
  trpc.users.me.prefetch()

  return (
    <HydrateClient>
      <PageWrapper className="space-y-4">
        <UpdateTeamNameForm />
        <UpdateTeamAvatarForm />
      </PageWrapper>
    </HydrateClient>
  )
}

export default SettingsPage
