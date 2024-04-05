import { snoozeTicket } from '@/actions/tickets'
import { getIconStyle } from '@/utils/get-icon-style'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { DateTimePicker } from '@seventy-seven/ui/date-time-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { format, isFuture, isToday } from 'date-fns'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { popModal } from '../modals'

const snoozeTicketFormSchema = z.object({
  date: z.date({ required_error: 'Please choose a date and time' }).refine(isFuture, {
    message: 'The date must be in the future',
  }),
})

type SnoozeTicketFormValues = z.infer<typeof snoozeTicketFormSchema>

type Props = {
  ticketId: string
}

export const SnoozeTicketForm = ({ ticketId }: Props) => {
  const action = useAction(snoozeTicket, {
    onSuccess: (updatedTicket) => {
      if (!updatedTicket.snoozed_until) {
        return
      }

      const date = format(
        updatedTicket.snoozed_until,
        isToday(updatedTicket.snoozed_until) ? 'HH:mm' : 'MMM dd (HH:mm)',
      )
      toast.success(`Ticket was snoozed until ${date}`)
      popModal('snoozeTicketModal')
    },
    onError: (err) => {
      toast.error(err.serverError)
      popModal('snoozeTicketModal')
    },
  })

  const form = useForm<SnoozeTicketFormValues>({
    resolver: zodResolver(snoozeTicketFormSchema),
  })

  const onSubmit = form.handleSubmit((values) => {
    action.execute({ ticketId, snoozedUntil: values.date })
  })

  const iconStyle = getIconStyle('snoozed')

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="sr-only">Choose date and time</FormLabel>
                <FormControl>
                  <DateTimePicker
                    stretch
                    date={field.value}
                    setDate={field.onChange}
                    disabled={{ before: new Date() }}
                  />
                </FormControl>
              </FormItem>
            )
          }}
        />

        <div className="pt-4 border-t border-border flex justify-between items-center">
          {form.formState.errors.date && <FormMessage message={form.formState.errors.date.message} />}

          <Button
            loading={action.status === 'executing'}
            type="submit"
            className="gap-2 ml-auto"
            disabled={form.watch('date') && !form.formState.isValid}
          >
            <Icon name={iconStyle.name} className={cn('size-5', iconStyle.className)} />
            {form.watch('date') ? `Snooze to ${format(form.getValues('date'), 'MMM dd (HH:mm)')}` : 'Snooze'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
