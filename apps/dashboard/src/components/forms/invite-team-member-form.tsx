import { getFakeEmail } from '@/utils/data'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import { cn } from '@seventy-seven/ui/utils'
import { type UseFieldArrayReturn, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const inviteTeamMemberFormSchema = z.object({
  invites: z
    .array(
      z.object({
        email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
      }),
    )
    .refine((invites) => [...new Set(invites.map((invite) => invite.email.toLowerCase()))].length === invites.length, {
      message: 'Duplicate emails are not allowed',
    }),
})

type InviteTeamMemberFormValues = z.infer<typeof inviteTeamMemberFormSchema>

type Props = {
  onSubmit: (values: InviteTeamMemberFormValues) => void
  loading?: boolean
}

export const InviteTeamMemberForm = ({ onSubmit, loading }: Props) => {
  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(inviteTeamMemberFormSchema),
    defaultValues: {
      invites: [{ email: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invites',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          {fields.map((_field, i) => {
            return (
              <FormField
                key={_field.id}
                control={form.control}
                name={`invites.${i}.email`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={_field.id} className={cn(i > 0 && 'sr-only')}>
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2 items-center">
                        <Input
                          id={_field.id}
                          autoComplete="off"
                          placeholder={getFakeEmail(i)}
                          {...field}
                          value={field.value ?? ''}
                        />
                        <FieldButtons fieldsLength={fields.length} append={append} remove={remove} index={i} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}
        </div>

        <div className="mt-4 flex justify-between">
          {form.formState.errors.invites?.root?.message && (
            <FormMessage>{form.formState.errors.invites?.root?.message}</FormMessage>
          )}
          <Button loading={loading} type="submit" className="ml-auto">
            {fields.length > 1 ? 'Invite members' : 'Invite member'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

type FieldButtonsProps = {
  fieldsLength: number
  append: UseFieldArrayReturn<InviteTeamMemberFormValues>['append']
  remove: UseFieldArrayReturn<InviteTeamMemberFormValues>['remove']
  index: number
}

const FieldButtons = ({ fieldsLength, append, remove, index }: FieldButtonsProps) => {
  // Field is the first and only field
  if (index === 0 && fieldsLength === 1) {
    return (
      <Button type="button" variant="outline" className="aspect-square p-0" onClick={() => append({ email: '' })}>
        <span className="sr-only">Add one more</span>
        <Icon name="plus" className="size-4" />
      </Button>
    )
  }

  // Field is first but there are more fields
  if (index === 0 && fieldsLength > 1) {
    return null
  }

  // Field is somewhere in between first and last
  if (index > 0 && fieldsLength > index + 1) {
    return (
      <Button type="button" variant="outline" className="aspect-square p-0" onClick={() => remove(index)}>
        <span className="sr-only">Add one more</span>
        <Icon name="minus" className="size-4" />
      </Button>
    )
  }

  // Field is last
  if (index > 0 && fieldsLength === index + 1) {
    return (
      <>
        <Button type="button" variant="outline" className="aspect-square p-0" onClick={() => remove(index)}>
          <span className="sr-only">Remove email</span>
          <Icon name="minus" className="size-4" />
        </Button>
        <Button type="button" variant="outline" className="aspect-square p-0" onClick={() => append({ email: '' })}>
          <span className="sr-only">Add one more</span>
          <Icon name="plus" className="size-4" />
        </Button>
      </>
    )
  }

  return null
}
