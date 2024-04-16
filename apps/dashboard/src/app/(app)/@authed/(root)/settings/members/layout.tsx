import { InviteTeamMemberButtonWrapper } from '@/components/invite-team-member-button-wrapper'
import { MembersListTabNav } from '@/components/members-list-tab-nav'
import { PageWrapper } from '@/components/page-wrapper'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { Suspense } from 'react'

type Props = {
  children: React.ReactNode
}

const MembersSettingsLayout = ({ children }: Props) => {
  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-4">
        <MembersListTabNav />

        <Suspense fallback={<Skeleton className="h-10 w-[196px]" />}>
          <InviteTeamMemberButtonWrapper />
        </Suspense>
      </div>

      {children}
    </PageWrapper>
  )
}

export default MembersSettingsLayout
