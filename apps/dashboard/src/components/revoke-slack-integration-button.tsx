'use client'

import { Button } from '@seventy-seven/ui/button'

export const RevokeSlackIntegrationButton = () => {
  return (
    <Button
      variant="destructive"
      loading={false}
      onClick={() => {
        alert('TODO: Revoke Slack integration')
      }}
    >
      Revoke Slack integration
    </Button>
  )
}
