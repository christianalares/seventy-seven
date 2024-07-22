import { api } from '@/queries'
import { InviteTeamMemberButton } from './invite-team-member-button'

export const InviteTeamMemberButtonWrapper = async () => {
  const currentTeam = await api.users.queries.myCurrentTeam()

  return <InviteTeamMemberButton team={currentTeam.current_team} />
}
