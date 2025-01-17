import { InviteTeamMemberButton } from '@/components/invite-team-member-button'
import { MembersListTabNav } from '@/components/members-list-tab-nav'
import { PageWrapper } from '@/components/page-wrapper'
import { HydrateClient, trpc } from '@/trpc/server'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
}

const MembersSettingsLayout = ({ children }: Props) => {
  trpc.users.myCurrentTeam.prefetch()

  return (
    <HydrateClient>
      <PageWrapper>
        <div className="flex justify-between items-center mb-4">
          <MembersListTabNav />
          <Suspense fallback={<Skeleton className="h-10 w-[196px]" />}>
            <InviteTeamMemberButton />
          </Suspense>
        </div>
        {children}
      </PageWrapper>
    </HydrateClient>
  )
}

export default MembersSettingsLayout
