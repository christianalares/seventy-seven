import { InviteTeamMemberButtonWrapper } from '@/components/invite-team-member-button-wrapper'
import { PageWrapper } from '@/components/page-wrapper'
import { TeamMembers, TeamMembersSkeleton } from '@/components/team-members'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import { Suspense } from 'react'

const MembersPage = () => {
  return (
    <PageWrapper>
      <div className="flex justify-end mb-4">
        <Suspense fallback={<Skeleton className="h-10 w-[196px]" />}>
          <InviteTeamMemberButtonWrapper />
        </Suspense>
      </div>
      <Suspense fallback={<TeamMembersSkeleton />}>
        <TeamMembers />
      </Suspense>
    </PageWrapper>
  )
}

export default MembersPage
