'use client'

import { revokeSlackIntegration } from '@/actions/integrations'
import { Button } from '@seventy-seven/ui/button'
import { useAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export const RevokeSlackIntegrationButton = () => {
  const pathname = usePathname()

  const action = useAction(revokeSlackIntegration, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Slack integration revoked')
      }
    },
  })

  return (
    <Button
      variant="destructive"
      loading={action.status === 'executing'}
      onClick={() => {
        action.execute({
          revalidatePath: pathname,
        })
      }}
    >
      Revoke Slack integration
    </Button>
  )
}
