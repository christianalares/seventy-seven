'use client'

import { updateEmailNotifications } from '@/actions/user'
import type { UsersFindMe } from '@/queries/users'
import { Label } from '@seventy-seven/ui/label'
import { Switch } from '@seventy-seven/ui/switch'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  user: UsersFindMe
}

export const NotificationsEmailSwitches = ({ user }: Props) => {
  const pathname = usePathname()

  const action = useOptimisticAction(
    updateEmailNotifications,
    {
      notification_email_new_ticket: user.notification_email_new_ticket,
      notification_email_new_message: user.notification_email_new_message,
    },
    (state, input) => {
      if (!state) {
        return state
      }

      if (input.type === 'new_ticket') {
        return {
          ...state,
          notification_email_new_ticket: input.value,
        }
      }

      if (input.type === 'new_messages') {
        return {
          ...state,
          notification_email_new_message: input.value,
        }
      }

      return state
    },
    {
      onSuccess: (_updatedUser) => {
        toast.success('Settings updated')
      },
    },
  )

  return (
    <div className="border border-border/50 rounded-lg divide-y divide-border/50">
      <Label className="flex items-center gap-4 p-4 text-base">
        <Switch
          checked={action.optimisticData?.notification_email_new_ticket}
          onCheckedChange={() => {
            action.execute({
              revalidatePath: pathname,
              type: 'new_ticket',
              value: !action.optimisticData?.notification_email_new_ticket,
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
