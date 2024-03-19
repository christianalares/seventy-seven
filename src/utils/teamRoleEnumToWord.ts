import type { Enums } from '@/types/db'
import { assertUnreachable } from './assertUnreachable'

export const teamRoleEnumToWord = (teamRole: Enums<'team_role_enum'>) => {
  switch (teamRole) {
    case 'MEMBER':
      return 'Member'
    case 'OWNER':
      return 'Owner'
    default:
      assertUnreachable(teamRole)
  }
}
