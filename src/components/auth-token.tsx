'use client'

import { generateAuthToken } from '@/actions/teams'
import type { UsersGetMyCurrentTeam } from '@/utils/supabase/queries/users'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { ClipboardButton } from './clipboard-button'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

type Props = {
  authToken: UsersGetMyCurrentTeam['current_team']['auth_token']
}

export const AuthToken = ({ authToken }: Props) => {
  const action = useAction(generateAuthToken, {
    onSuccess: ({ isNew }) => {
      toast.success(isNew ? 'Token created' : 'Token re-generated')
    },
    onError: (err) => {
      toast.error(err.serverError, {
        action: {
          label: 'Retry',
          onClick: () => action.execute(undefined),
        },
      })
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorization token</CardTitle>
        <CardDescription>Do not share this key and make sure to only store it in a .env file</CardDescription>
      </CardHeader>

      <CardContent>
        {authToken && (
          <div className="flex items-center border rounded-md px-2">
            <Input defaultValue={authToken} disabled className="border-0 px-0" />
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
              onClick={() => action.execute(undefined)}
              variant="destructive"
            >
              Re-generate
            </Button>
          </>
        ) : (
          <>
            <p>You have no authorizatio token, click the button to generate one.</p>
            <Button loading={action.status === 'executing'} onClick={() => action.execute(undefined)}>
              Generate
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
