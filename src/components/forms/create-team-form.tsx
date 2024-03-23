import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

const createTeamFormSchema = z.object({
  name: z.string({ required_error: 'Team name is required' }).min(1, {
    message: 'Team name is required',
  }),
})

type CreateTeamFormValues = z.infer<typeof createTeamFormSchema>

type Props = {
  onSubmit: (values: CreateTeamFormValues) => void
  loading?: boolean
}

export const CreateTeamForm = ({ onSubmit, loading }: Props) => {
  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamFormSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-end">
          <Button loading={loading} variant="secondary" type="submit">
            Create team
          </Button>
        </div>
      </form>
    </Form>
  )
}
