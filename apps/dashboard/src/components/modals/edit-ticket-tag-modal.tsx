'use client'

import { trpc } from '@/trpc/client'
import type { UsersRouter } from '@/trpc/routers/users-router'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { toast } from 'sonner'
import { popModal } from '.'
import { TicketTagForm } from '../forms/ticket-tag-form'

type Props = {
  tag: UsersRouter.MyCurrentTeam['current_team']['ticket_tags'][number]
}

export const EditTicketTagModal = ({ tag }: Props) => {
  const trpcUtils = trpc.useUtils()

  const editTagMutation = trpc.ticketTags.edit.useMutation({
    onSuccess: () => {
      trpcUtils.users.myCurrentTeam.invalidate()

      toast.success('Tag updated')
      popModal('editTicketTagModal')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit tag</ModalTitle>
        <ModalDescription>Change the color and/or the name</ModalDescription>
      </ModalHeader>

      <TicketTagForm
        defaultValues={{
          name: tag.name,
          color: tag.color,
        }}
        onSubmit={(values) => {
          editTagMutation.mutate({
            id: tag.id,
            name: values.name,
            color: values.color,
          })
        }}
        onClose={() => popModal('editTicketTagModal')}
        isLoading={editTagMutation.isPending}
        ctaText="Save tag"
      />
    </Modal>
  )
}
