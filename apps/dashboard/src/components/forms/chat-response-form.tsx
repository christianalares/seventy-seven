'use client'

import { createMessage } from '@/actions/messages'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { Textarea } from '@seventy-seven/ui/textarea'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const chatResponseFormSchema = z.object({
  message: z
    .string({ message: 'A message is required' })
    .min(1, { message: 'A message is required' })
    .max(1000, { message: 'Message cannot be longer than 1000 characters' }),
})

type ChatResponseFormValues = z.infer<typeof chatResponseFormSchema>

type Props = {
  ticketId: string
}

export const ChatResponseForm = ({ ticketId }: Props) => {
  const form = useForm<ChatResponseFormValues>({
    resolver: zodResolver(chatResponseFormSchema),
    defaultValues: {
      message: '',
    },
  })

  const action = useAction(createMessage, {
    onSuccess: (_createdMessage) => {
      toast.success('Message sent!')
      form.reset()
    },
    onError: (err, input) => {
      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () =>
            action.execute({
              ticketId,
              body: input.body,
            }),
        },
      })
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    action.execute({
      ticketId,
      body: values.message,
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="p-2 flex flex-col">
        <div className="relative group">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => {
              return (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">Write a response</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a response"
                      className="rounded-none p-4 min-h-0 h-12 group-has-[:focus]:h-[20vh] transition-[height] duration-300 resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )
            }}
          />

          <Button
            className="absolute bottom-2 right-2"
            loading={action.status === 'executing'}
            size="icon-sm"
            type="submit"
          >
            <Icon name="send" className="size-4" />
            <span className="sr-only">Send response</span>
          </Button>
        </div>

        <FormMessage className="my-2" message={form.formState.errors.message?.message} />
      </form>
    </Form>
  )
}
