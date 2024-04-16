import { usersQueries } from '@/queries/users'
import { InviteTeamMemberButton } from './invite-team-member-button'

export const InviteTeamMemberButtonWrapper = async () => {
  const currentTeam = await usersQueries.myCurrentTeam()

  return <InviteTeamMemberButton team={currentTeam.current_team} />
}
