import { PendingTeamMembers, PendingTeamMembersSkeleton } from '@/components/pending-team-members'
import { Suspense } from 'react'

const PendingMembersPage = async () => {
  return (
    <Suspense fallback={<PendingTeamMembersSkeleton />}>
      <PendingTeamMembers />
    </Suspense>
  )
}

export default PendingMembersPage
