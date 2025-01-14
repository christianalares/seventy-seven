import { PendingTeamMembers, PendingTeamMembersSkeleton } from '@/components/pending-team-members'
import { HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'

const PendingMembersPage = () => {
  trpc.teams.invites.prefetch()

  return (
    <HydrateClient>
      <Suspense fallback={<PendingTeamMembersSkeleton />}>
        <PendingTeamMembers />
      </Suspense>
    </HydrateClient>
  )
}

export default PendingMembersPage
