'use client'

import { trpc } from '@/trpc/client'
import { Label } from '@seventy-seven/ui/label'
import { Switch } from '@seventy-seven/ui/switch'
import { toast } from 'sonner'

export const NotificationsEmailSwitches = () => {
  const trpcUtils = trpc.useUtils()
  const [me] = trpc.users.me.useSuspenseQuery()

  const updateEmailNotificationsMutation = trpc.users.updateEmailNotifications.useMutation({
    onMutate: ({ type, value }) => {
      trpcUtils.users.me.setData(undefined, (prev) => {
        if (!prev) {
          return prev
        }

        if (type === 'new_ticket') {
          return {
            ...prev,
            notification_email_new_ticket: value,
          }
        }

        if (type === 'new_messages') {
          return {
            ...prev,
            notification_email_new_message: value,
          }
        }

        return prev
      })
    },
    onSuccess: () => {
      toast.success('Notification settings updated')
    },
  })

  return (
    <div className="border border-border/50 rounded-lg divide-y divide-border/50">
      <Label className="flex items-center gap-4 p-4 text-base">
        <Switch
          disabled={updateEmailNotificationsMutation.isPending}
          checked={me.notification_email_new_ticket}
          onCheckedChange={() => {
            updateEmailNotificationsMutation.mutate({
              type: 'new_ticket',
              value: !me.notification_email_new_ticket,
            })
          }}
        />
        Incoming tickets in teams you're a member of
      </Label>

      {/* <Label className="flex items-center gap-4 p-4 text-base">
        <Switch
          checked={action.optimisticData?.notification_email_new_message}
          onCheckedChange={() => {
            action.execute({
              revalidatePath: pathname,
              type: 'new_messages',
              value: !action.optimisticData?.notification_email_new_message,
            })
          }}
        />
        <div className="flex flex-col">
          <span>New messages in tickets you're assigned to</span>
          <span className="text-sm text-muted">
            If the user responds to your message you will get notified even if you are not the assigned member
          </span>
        </div>
      </Label> */}
    </div>
  )
}
