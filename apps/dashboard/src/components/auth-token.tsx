'use client'

import { generateAuthToken } from '@/actions/teams'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Input } from '@seventy-seven/ui/input'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { ClipboardButton } from './clipboard-button'

type Props = {
  authToken: UsersGetMyCurrentTeam['current_team']['auth_token']
}

export const AuthToken = ({ authToken }: Props) => {
  const pathname = usePathname()

  const action = useAction(generateAuthToken, {
    onSuccess: ({ isNew }) => {
      toast.success(isNew ? 'Token created' : 'Token re-generated')
    },
    onError: (err, input) => {
      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () => action.execute(input),
        },
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorization token</CardTitle>
        <CardDescription>
          This token needs to be provided when creating tickets via the API.
          <br />
          You can read more about that on the{' '}
          <Link prefetch className="text-primary font-semibold hover:underline" href="/help">
            help section
          </Link>
          . Do not share this key and make sure to only store it in a .env file
        </CardDescription>
      </CardHeader>

      <CardContent>
        {authToken && (
          <div className="flex items-center border rounded-md px-2">
            <Input key={authToken} defaultValue={authToken} disabled className="border-0 px-0" />
            <ClipboardButton text={authToken} />
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-between">
        {authToken ? (
          <>
            <p>Revoke and generate a new token</p>
            <Button
              loading={action.status === 'executing'}
              onClick={() => action.execute({ revalidatePath: pathname })}
              variant="destructive"
            >
              Re-generate
            </Button>
          </>
        ) : (
          <>
            <p>You have no authorization token, click the button to generate one.</p>
            <Button
              loading={action.status === 'executing'}
              onClick={() => action.execute({ revalidatePath: pathname })}
            >
              Generate
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
