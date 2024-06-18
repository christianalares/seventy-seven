'use client'

import { AlertDialog } from '@seventy-seven/ui/alert'
import { createPushModal } from '@seventy-seven/ui/modal'
import { ConfirmChangeYourOwnRoleAlert } from './confirm-change-your-own-role'
import { ConfirmLeaveTeamAlert } from './confirm-leave-team-alert'
import { ConfirmRemoveTeamMemberAlert } from './confirm-remove-team-member-alert'
import { ProhibitLastOwnerRoleChangeAlert } from './prohibit-last-owner-role-change-alert'

export const {
  pushModal: pushAlert,
  popModal: popAlert,
  ModalProvider: AlertProvider,
} = createPushModal({
  modals: {
    confirmLeaveTeam: {
      Component: ConfirmLeaveTeamAlert,
      Wrapper: (props) => <AlertDialog {...props} />,
    },
    confirmRemoveTeamMember: {
      Component: ConfirmRemoveTeamMemberAlert,
      Wrapper: (props) => <AlertDialog {...props} />,
    },
    confirmChangeYourOwnRole: {
      Component: ConfirmChangeYourOwnRoleAlert,
      Wrapper: (props) => <AlertDialog {...props} />,
    },
    prohibitLastOwnerRoleChange: {
      Component: ProhibitLastOwnerRoleChangeAlert,
      Wrapper: (props) => <AlertDialog {...props} />,
    },
  },
})
