import { TeamMembers, TeamMembersSkeleton } from '@/components/team-members'
import { Suspense } from 'react'

const MembersPage = () => {
  return (
    <Suspense fallback={<TeamMembersSkeleton />}>
      <TeamMembers />
    </Suspense>
  )
}

export default MembersPage
