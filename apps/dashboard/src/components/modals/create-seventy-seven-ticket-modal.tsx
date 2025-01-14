'use client'

import { trpc } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Input } from '@seventy-seven/ui/input'
import { Label } from '@seventy-seven/ui/label'
import { Modal, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@seventy-seven/ui/modal'
import { Textarea } from '@seventy-seven/ui/textarea'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { popModal } from '.'

const createSeventySevenTicketFormSchema = z.object({
  fullName: z.string({ required_error: 'Full name is required' }).min(2, { message: 'Full name is required' }),
  subject: z.string({ required_error: 'Subject is required' }).min(1, { message: 'Subject is required' }),
  body: z.string({ required_error: 'Body is required' }).min(10, { message: 'Body must be at least 10 characters' }),
})

type CreateSeventySevenTicketFormValues = z.infer<typeof createSeventySevenTicketFormSchema>

export const CreateSeventySevenTicketModal = () => {
  const [me] = trpc.users.me.useSuspenseQuery()

  const createSeventySevenTicketMutation = trpc.seventySeven.createTicket.useMutation({
    onSuccess: (_createdTicket) => {
      popModal('createSeventySevenTicketModal')

      toast.success('Ticket has been created', {
        description: 'We will get back to you ASAP.',
      })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<CreateSeventySevenTicketFormValues>({
    resolver: zodResolver(createSeventySevenTicketFormSchema),
    defaultValues: {
      fullName: me.full_name,
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    createSeventySevenTicketMutation.mutate({
      fullName: values.fullName,
      subject: values.subject,
      body: values.body,
    })
  })

  return (
    <Modal>
      <ModalHeader>
        <ModalTitle>Create ticket</ModalTitle>
        <ModalDescription>Let us know what tou have in mind and we'll back to you.</ModalDescription>
      </ModalHeader>

      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Label className="block flex-1">
              <span>Full name</span>
              <Input className="mt-2" {...form.register('fullName')} />
              <ErrorMessage message={form.formState.errors.fullName?.message} />
            </Label>

            <Label className="block flex-1">
              <span>Email</span>
              <Input disabled defaultValue={me.email} className="mt-2" />
            </Label>
          </div>

          <Label className="block">
            <span>Subject</span>
            <Input className="mt-2" {...form.register('subject')} />
            <ErrorMessage message={form.formState.errors.subject?.message} />
          </Label>

          <Label className="block">
            <span>What do you need help with?</span>
            <Textarea className="mt-2" {...form.register('body')} />
            <ErrorMessage message={form.formState.errors.body?.message} />
          </Label>
        </div>

        <ModalFooter className="mt-6">
          <Button type="button" variant="secondary" onClick={() => popModal('createSeventySevenTicketModal')}>
            Cancel
          </Button>
          <Button type="submit" loading={createSeventySevenTicketMutation.isPending}>
            Create ticket
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
