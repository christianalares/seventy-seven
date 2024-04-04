import { getIconStyle } from '@/utils/get-icon-style'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { DateTimePicker } from '@seventy-seven/ui/date-time-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { cn } from '@seventy-seven/ui/utils'
import { format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const snoozeTicketFormSchema = z.object({
  date: z.date({ required_error: 'Please choose a date and time' }),
})

type SnoozeTicketFormValues = z.infer<typeof snoozeTicketFormSchema>

export const SnoozeTicketForm = () => {
  const form = useForm<SnoozeTicketFormValues>({
    resolver: zodResolver(snoozeTicketFormSchema),
  })

  const onSubmit = form.handleSubmit((values) => {
    console.log(values)
  })

  const iconStyle = getIconStyle('snoozed')

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            // console.log('date', field.value)
            return (
              <FormItem>
                <FormLabel className="sr-only">Choose date and time</FormLabel>
                <FormControl>
                  <DateTimePicker stretch date={field.value} setDate={field.onChange} />
                </FormControl>
              </FormItem>
            )
          }}
        />

        <div className="pt-4 border-t border-border flex justify-between items-center">
          {form.formState.errors.date && <FormMessage message={form.formState.errors.date.message} />}

          <Button type="submit" className="gap-2 ml-auto">
            <Icon name={iconStyle.name} className={cn('size-5', iconStyle.className)} />
            {form.formState.isValid ? `Snooze to ${format(form.getValues('date'), 'MMM dd (HH:mm)')}` : 'Snooze'}
            {/* {form.formState.isValid
              ? `Snooze to ${new Intl.DateTimeFormat('sv-SE', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(form.getValues('date'))}`
              : 'Snooze'} */}
          </Button>
        </div>
      </form>
    </Form>
  )
}
