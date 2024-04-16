'use client'

import { inviteTeamMembers } from '@/actions/teams'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { pluralize } from '@/utils/pluralize'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { popModal } from '.'
import { InviteTeamMemberForm } from '../forms/invite-team-member-form'

type Props = {
  team: UsersGetMyCurrentTeam['current_team']
}

export const InviteTeamMemberModal = ({ team }: Props) => {
  const action = useAction(inviteTeamMembers, {
    onSuccess: (numberOfCreatedInvites) => {
      popModal('inviteTeamMemberModal')
      toast.success(`You invited ${pluralize(numberOfCreatedInvites, 'member', 'members')}`)
    },
    onError: (err, input) => {
      // popModal('inviteTeamMemberModal')

      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () =>
            action.execute({
              emails: input.emails,
              teamId: input.teamId,
            }),
        },
      })
    },
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Invite member to {team.name}</ModalTitle>
        <ModalDescription>The user(s) will recieve an email with a link to join this team</ModalDescription>
      </ModalHeader>
      <InviteTeamMemberForm
        onSubmit={(values) => {
          action.execute({
            emails: values.invites.map(({ email }) => email),
            teamId: team.id,
          })
        }}
        loading={action.status === 'executing'}
      />{' '}
    </Modal>
  )
}
