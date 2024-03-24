'use client'

import { updateTeamName } from '@/actions/teams'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { type UseTeamFormArgs, useTeamForm } from './hooks/use-team-form'

type Props = {
  teamId: string
  defaultValues: UseTeamFormArgs['defaultValues']
}

export const UpdateTeamNameForm = ({ teamId, defaultValues }: Props) => {
  const action = useAction(updateTeamName, {
    onSuccess: (updatedTeam) => {
      toast.success(`Team renamed to "${updatedTeam.name}"`)
      form.reset({ name: updatedTeam.name })
    },
    onError: (err, input) => {
      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () =>
            action.execute({
              name: input.name,
              teamId,
            }),
        },
      })
    },
  })
  const form = useTeamForm({ defaultValues })

  const onSubmit = form.handleSubmit((values) => {
    action.execute({
      teamId,
      name: values.name,
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team name</CardTitle>
        <CardDescription>The name of your team could be the name of your organization or company.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={onSubmit} key={action.status}>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team name</FormLabel>
                  <FormControl>
                    <Input className="max-w-80" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="justify-between">
            {form.formState.errors.name?.message ? (
              <FormMessage message={form.formState.errors.name.message} />
            ) : (
              <p>Can be between 2 and 32 characters.</p>
            )}

            <Button loading={action.status === 'executing'} type="submit" size="sm">
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
