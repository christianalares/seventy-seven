'use client'

import { trpc } from '@/trpc/client'
import { Button } from '@seventy-seven/ui/button'
import { toast } from 'sonner'

export const RevokeSlackIntegrationButton = () => {
  const trpcUtils = trpc.useUtils()

  const revokeSlackIntegrationMutation = trpc.integrations.revokeSlackIntegration.useMutation({
    onSuccess: (data) => {
      trpcUtils.integrations.getSlackIntegration.invalidate()

      if (data.success) {
        toast.success('Slack integration revoked')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <Button
      variant="destructive"
      loading={revokeSlackIntegrationMutation.isPending}
      onClick={() => {
        revokeSlackIntegrationMutation.mutate()
      }}
    >
      Revoke Slack integration
    </Button>
  )
}
