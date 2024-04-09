import type { Folder } from '@/queries/tickets'
import type { IconName } from '@seventy-seven/ui/icon'

const r = (name: IconName, className: string) => ({ name, className })

export const getIconStyle = (type?: Folder): ReturnType<typeof r> => {
  switch (type) {
    case 'snoozed':
      return r('alarmClock', 'text-orange-500')
    case 'drafts':
      return r('scrollText', 'text-blue-500')
    case 'responded':
      return r('send', 'text-green-500')
    case 'closed':
      return r('checkCircle', 'text-destructive')
    default:
      return r('folderClosed', 'text-primary')
  }
}
