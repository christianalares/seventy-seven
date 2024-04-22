'use client'

import { AlertDialog } from '@seventy-seven/ui/alert'
import { createPushModal } from '@seventy-seven/ui/modal'
import { ConfirmLeaveTeamAlert } from './confirm-leave-team-alert'
import { ConfirmRemoveTeamMemberAlert } from './confirm-remove-team-member-alert'

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
  },
})
