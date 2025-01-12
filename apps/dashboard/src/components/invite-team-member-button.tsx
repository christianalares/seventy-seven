'use client'

import { trpc } from '@/trpc/client'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { pushModal } from './modals'

export const InviteTeamMemberButton = () => {
  const [team] = trpc.users.myCurrentTeam.useSuspenseQuery()

  return (
    <Button className="gap-2" onClick={() => pushModal('inviteTeamMemberModal', { team: team.current_team })}>
      <Icon name="userPlus" className="size-5" />
      Invite member
    </Button>
  )
}
