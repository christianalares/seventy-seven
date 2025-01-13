import { TeamMembers, TeamMembersSkeleton } from '@/components/team-members'
import { trpc } from '@/trpc/server'
import { Suspense } from 'react'

const MembersPage = () => {
  trpc.users.myCurrentTeam.prefetch()

  return (
    <Suspense fallback={<TeamMembersSkeleton />}>
      <TeamMembers />
    </Suspense>
  )
}

export default MembersPage
