'use client'

import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { pushModal } from './modals'

type Props = {
  team: UsersGetMyCurrentTeam['current_team']
}

export const InviteTeamMemberButton = ({ team }: Props) => {
  return (
    <Button className="gap-2" onClick={() => pushModal('inviteTeamMemberModal', { team })}>
      <Icon name="userPlus" className="size-5" />
      Invite Team Member
    </Button>
  )
}
