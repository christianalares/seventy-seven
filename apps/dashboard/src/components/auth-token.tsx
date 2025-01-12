'use client'

import { trpc } from '@/trpc/client'
import { Button } from '@seventy-seven/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import Link from 'next/link'
import { toast } from 'sonner'
import { ClipboardButton } from './clipboard-button'
import { PageWrapper } from './page-wrapper'

export const AuthToken = () => {
  const [user] = trpc.users.myCurrentTeam.useSuspenseQuery()
  const trpcUtils = trpc.useUtils()

  const generateAuthTokenMutation = trpc.teams.generateAuthToken.useMutation({
    onSuccess: ({ isNew }) => {
      trpcUtils.users.myCurrentTeam.invalidate()

      toast.success(isNew ? 'Token created' : 'Token re-generated')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const authToken = user.current_team.auth_token

  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="fingerprint" />
            Authorization token
          </CardTitle>
          <CardDescription>
            This token needs to be provided when creating tickets via the API.
            <br />
            You can read more about that on the{' '}
            <Link prefetch className="text-blue-500" href="/help">
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
                loading={generateAuthTokenMutation.isPending}
                onClick={() => generateAuthTokenMutation.mutate()}
                variant="destructive"
              >
                Re-generate
              </Button>
            </>
          ) : (
            <>
              <p>You have no authorization token, click the button to generate one.</p>
              <Button loading={generateAuthTokenMutation.isPending} onClick={() => generateAuthTokenMutation.mutate()}>
                Generate
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </PageWrapper>
  )
}
