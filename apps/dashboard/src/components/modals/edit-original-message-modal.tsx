'use client'

import { trpc } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Label } from '@seventy-seven/ui/label'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { Textarea } from '@seventy-seven/ui/textarea'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { popModal } from '.'

type Props = {
  message: string
  messageId: string
}

const editOriginalMessageFormSchema = z.object({
  message: z
    .string({ message: 'A message is required' })
    .min(1, { message: 'A message is required' })
    .max(1000, { message: 'Message cannot be longer than 1000 characters' }),
})

type EditOriginalMessageFormValues = z.infer<typeof editOriginalMessageFormSchema>

export const EditOriginalMessageModal = ({ message, messageId }: Props) => {
  const trpcUtils = trpc.useUtils()

  const editMessageMutation = trpc.messages.edit.useMutation({
    onSuccess: (_updatedMessage) => {
      trpcUtils.tickets.findById.invalidate()

      toast.success('Message was updated', {
        description: 'The message was saved and marked as parsed',
      })

      popModal('editOriginalMessageModal')
      setTimeout(() => popModal('viewOriginalMessageContentModal'), 500)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<EditOriginalMessageFormValues>({
    resolver: zodResolver(editOriginalMessageFormSchema),
    defaultValues: {
      message,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    editMessageMutation.mutate({
      messageId,
      body: values.message,
    })
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Edit original message</ModalTitle>
        <ModalDescription>
          When you save this message, it will be marked as parsed and will be displayed in the chat.
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={onSubmit}>
        <Label className="space-y-2">
          <span>Message</span>
          <Textarea className="h-60" {...form.register('message')} />
        </Label>

        <ErrorMessage message={form.formState.errors.message?.message} />

        <ModalFooter className="mt-4">
          <Button type="submit" loading={editMessageMutation.isPending}>
            Save and marked as parsed
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) {
    return null
  }

  return <p className="text-xs text-destructive mt-2">{message}</p>
}
