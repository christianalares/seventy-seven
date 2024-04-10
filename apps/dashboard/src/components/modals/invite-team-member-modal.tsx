'use client'

import { createTeam } from '@/actions/teams'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { popModal } from '.'
import { InviteTeamMemberForm } from '../forms/invite-team-member-form'

type Props = {
  team: UsersGetMyCurrentTeam['current_team']
}

export const InviteTeamMemberModal = ({ team }: Props) => {
  const action = useAction(createTeam, {
    onSuccess: (createdTeam) => {
      popModal('createTeamModal')
      toast.success(`Team "${createdTeam.name}" created successfully`)
    },
    onError: (err, input) => {
      popModal('createTeamModal')

      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () =>
            action.execute({
              name: input.name,
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
          console.log(values)
          // action.execute({ name: values.name })
        }}
        loading={action.status === 'executing'}
      />{' '}
    </Modal>
  )
}
