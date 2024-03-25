import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { type CreateTeamFormValues, useTeamForm } from './hooks/use-team-form'

type Props = {
  onSubmit: (values: CreateTeamFormValues) => void
  loading?: boolean
}

export const CreateTeamForm = ({ onSubmit, loading }: Props) => {
  const form = useTeamForm()

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
