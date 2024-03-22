'use client'

import { createMessage } from '@/actions/messages'
import { cn } from '@/lib/utils'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Textarea } from '../ui/textarea'

const chatResponseFormSchema = z.object({
  message: z.string().min(1).max(1000),
})

type ChatResponseFormValues = z.infer<typeof chatResponseFormSchema>

type Props = {
  ticketId: string
}

export const ChatResponseForm = ({ ticketId }: Props) => {
  const form = useForm<ChatResponseFormValues>({
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
      {/* <button
        type="button"
        onClick={() => {
          form.reset()
        }}
      >
        Click
      </button> */}
      <form className="relative border rounded-md" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => {
            return (
              <FormItem className="space-y-0">
                <FormLabel className="p-4 block">Write a response</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[15vh] border-0 rounded-none mt-0" {...field} />
                </FormControl>
              </FormItem>
            )
          }}
        />

        <div className="p-2 flex items-center justify-end">
          <Button size="sm" type="submit" variant="secondary">
            Send response
          </Button>
        </div>
      </form>
    </Form>
  )
}
