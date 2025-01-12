'use client'

import { trpc } from '@/trpc/client'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { toast } from 'sonner'
import { popModal } from '.'
import { CreateTeamForm } from '../forms/create-team-form'

export const CreateTeamModal = () => {
  const trpcUtils = trpc.useUtils()

  const createTeamMutation = trpc.teams.create.useMutation({
    onSuccess: (createdTeam) => {
      trpcUtils.teams.findMany.invalidate()

      popModal('createTeamModal')
      toast.success(`Team "${createdTeam.name}" created successfully`)
    },
    onError: (error) => {
      popModal('createTeamModal')
      toast.error(error.message)
    },
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Create a team</ModalTitle>
        <ModalDescription>The name of your team could be the name of your organization or company.</ModalDescription>
      </ModalHeader>
      <CreateTeamForm
        onSubmit={(values) => {
          createTeamMutation.mutate({ name: values.name })
        }}
        loading={createTeamMutation.isPending}
      />{' '}
    </Modal>
  )
}
