'use client'

import { trpc } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const editDisplayNameFormSchema = z.object({
  displayName: z.string(),
})

type EditDisplayNameFormValues = z.infer<typeof editDisplayNameFormSchema>

export const EditDisplayNameForm = () => {
  const [me] = trpc.users.me.useSuspenseQuery()
  const trpcUtils = trpc.useUtils()

  const updateDisplayNameMutation = trpc.users.updateDisplayName.useMutation({
    onSuccess: (updatedUser) => {
      trpcUtils.users.me.invalidate()

      form.reset({ displayName: updatedUser.full_name })

      toast.success(`Display name updated to "${updatedUser.full_name}"`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<EditDisplayNameFormValues>({
    resolver: zodResolver(editDisplayNameFormSchema),
    defaultValues: {
      displayName: me.full_name,
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    updateDisplayNameMutation.mutate({
      displayName: values.displayName,
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="user" />
              Display name
            </CardTitle>
            <CardDescription>
              This will be shown in tickets you respond to, ticket emails to your users and everywhere in this app
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className="flex-1 flex flex-col gap-2">
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input className="w-full md:w-1/2" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="justify-between">
            <p>Provide a display name that is suitable for your users and your team.</p>
            <Button type="submit" loading={updateDisplayNameMutation.isPending}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
