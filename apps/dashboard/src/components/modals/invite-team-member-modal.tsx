'use client'

import { trpc } from '@/trpc/client'
import type { UsersRouter } from '@/trpc/routers/users-router'
import { pluralize } from '@/utils/pluralize'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { toast } from 'sonner'
import { popModal } from '.'
import { InviteTeamMemberForm } from '../forms/invite-team-member-form'

type Props = {
  team: UsersRouter.MyCurrentTeam['current_team']
}

export const InviteTeamMemberModal = ({ team }: Props) => {
  const trpcUtils = trpc.useUtils()

  const inviteTeamMembersMutation = trpc.teams.invite.useMutation({
    onSuccess: (numberOfCreatedInvites) => {
      trpcUtils.teams.invites.invalidate()

      popModal('inviteTeamMemberModal')
      toast.success(`You invited ${pluralize(numberOfCreatedInvites, 'member', 'members')}`)
    },
    onError: (error) => {
      toast.error(error.message)
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
          inviteTeamMembersMutation.mutate({
            emails: values.invites.map(({ email }) => email),
            teamId: team.id,
          })
        }}
        loading={inviteTeamMembersMutation.isPending}
      />{' '}
    </Modal>
  )
}
