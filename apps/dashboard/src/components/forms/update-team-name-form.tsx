'use client'

import { trpc } from '@/trpc/client'
import { Button } from '@seventy-seven/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useTeamForm } from './hooks/use-team-form'

export const UpdateTeamNameForm = () => {
  const [me] = trpc.users.me.useSuspenseQuery()

  useEffect(() => {
    form.reset({ name: me.current_team.name })
  }, [me.current_team.name])

  const trpcUtils = trpc.useUtils()

  const updateTeamNameMutation = trpc.teams.updateName.useMutation({
    onSuccess: (updatedTeam) => {
      trpcUtils.users.me.invalidate()

      toast.success(`Team renamed to "${updatedTeam.name}"`)
      form.reset({ name: updatedTeam.name })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useTeamForm({
    defaultValues: {
      name: me.current_team.name,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    updateTeamNameMutation.mutate({
      teamId: me.current_team_id,
      name: values.name,
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="team" />
          Team name
        </CardTitle>
        <CardDescription>The name of your team could be the name of your organization or company.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={onSubmit}>
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
              <p>Can be between 2 and 32 characters</p>
            )}

            <Button loading={updateTeamNameMutation.isPending} type="submit" size="sm">
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
