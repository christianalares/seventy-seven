'use client'

import { createTeam } from '@/actions/teams'
import { ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { popModal } from '.'
import { CreateTeamForm } from '../forms/create-team-form'

export const CreateTeamModal = () => {
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
    <div>
      <ModalHeader>
        <ModalTitle>Create a team</ModalTitle>
        <ModalDescription>The name of your team could be the name of your organization or company.</ModalDescription>
      </ModalHeader>
      <CreateTeamForm
        onSubmit={(values) => {
          action.execute({ name: values.name })
        }}
        loading={action.status === 'executing'}
      />{' '}
    </div>
  )
}
