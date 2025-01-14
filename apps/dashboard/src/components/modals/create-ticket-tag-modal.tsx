'use client'

import { trpc } from '@/trpc/client'
import { getRandomTagColor } from '@/utils/colors'
import { Modal, ModalDescription, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { toast } from 'sonner'
import { popModal } from '.'
import { TicketTagForm } from '../forms/ticket-tag-form'

export const CreateTicketTagModal = () => {
  const trpcUtils = trpc.useUtils()

  const createTagMutation = trpc.ticketTags.create.useMutation({
    onSuccess: () => {
      trpcUtils.users.myCurrentTeam.invalidate()

      toast.success('Tag created')
      popModal('createTicketTagModal')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Create tag</ModalTitle>
        <ModalDescription>Change the color and/or the name</ModalDescription>
      </ModalHeader>

      <TicketTagForm
        defaultValues={{
          name: '',
          color: getRandomTagColor(),
        }}
        onSubmit={(values) => {
          createTagMutation.mutate({
            name: values.name,
            color: values.color,
          })
        }}
        onClose={() => popModal('createTicketTagModal')}
        isLoading={createTagMutation.isPending}
        ctaText="Create tag"
      />
    </Modal>
  )
}
