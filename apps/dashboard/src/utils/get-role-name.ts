import type { TEAM_ROLE_ENUM } from '@seventy-seven/orm/prisma'
import { assertUnreachable } from './assertUnreachable'

export const getRoleName = (role: TEAM_ROLE_ENUM) => {
  switch (role) {
    case 'MEMBER':
      return 'Member'
    case 'OWNER':
      return 'Owner'

    default:
      assertUnreachable(role)
  }
}
