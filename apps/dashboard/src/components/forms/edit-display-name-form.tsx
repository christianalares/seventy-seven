'use client'

import { updateDisplayName } from '@/actions/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@seventy-seven/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@seventy-seven/ui/form'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { type DefaultValues, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const editDisplayNameFormSchema = z.object({
  displayName: z.string(),
})

type EditDisplayNameFormValues = z.infer<typeof editDisplayNameFormSchema>

type Props = {
  defaultValues?: DefaultValues<EditDisplayNameFormValues>
}

export const EditDisplayNameForm = ({ defaultValues }: Props) => {
  const pathname = usePathname()

  const action = useAction(updateDisplayName, {
    onSuccess: (updatedUser) => {
      toast.success(`Display name updated to "${updatedUser.full_name}"`)
    },
    onError: (error) => {
      toast.error(error.serverError)
    },
  })

  const form = useForm<EditDisplayNameFormValues>({
    resolver: zodResolver(editDisplayNameFormSchema),
    defaultValues,
  })

  const onSubmit = form.handleSubmit((values) => {
    action.execute({
      revalidatePath: pathname,
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
            <Button type="submit" loading={action.status === 'executing'}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
