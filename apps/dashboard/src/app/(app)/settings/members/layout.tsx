import { InviteTeamMemberButton } from '@/components/invite-team-member-button'
import { MembersListTabNav } from '@/components/members-list-tab-nav'
import { PageWrapper } from '@/components/page-wrapper'
import { trpc } from '@/trpc/server'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { Suspense } from 'react'

type Props = {
  children: React.ReactNode
}

const MembersSettingsLayout = ({ children }: Props) => {
  trpc.users.myCurrentTeam.prefetch()

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-4">
        <MembersListTabNav />

        <Suspense fallback={<Skeleton className="h-10 w-[196px]" />}>
          <InviteTeamMemberButton />
        </Suspense>
      </div>

      {children}
    </PageWrapper>
  )
}

export default MembersSettingsLayout
