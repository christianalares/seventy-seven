import { PendingTeamMembers, PendingTeamMembersSkeleton } from '@/components/pending-team-members'
import { trpc } from '@/trpc/server'
import { Suspense } from 'react'

const PendingMembersPage = () => {
  trpc.teams.invites.prefetch()

  return (
    <Suspense fallback={<PendingTeamMembersSkeleton />}>
      <PendingTeamMembers />
    </Suspense>
  )
}

export default PendingMembersPage
