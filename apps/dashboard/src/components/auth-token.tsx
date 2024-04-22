'use client'

import { generateAuthToken } from '@/actions/teams'
import type { UsersGetMyCurrentTeam } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'
import { Input } from '@seventy-seven/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@seventy-seven/ui/tooltip'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { ClipboardButton } from './clipboard-button'

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
        <CardDescription>
          This token needs to be provided when creating tickets via the API. You can read more about that in the{' '}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <span className="font-medium underline cursor-pointer">docs</span>
              </TooltipTrigger>
              <TooltipContent asChild>
                <span className="text-xs flex items-center gap-2">
                  <Icon name="circleAlert" strokeWidth={3} className="size-3" />
                  Coming soon
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          . Do not share this key and make sure to only store it in a .env file
        </CardDescription>
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
            <p>You have no authorization token, click the button to generate one.</p>
            <Button loading={action.status === 'executing'} onClick={() => action.execute(undefined)}>
              Generate
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
