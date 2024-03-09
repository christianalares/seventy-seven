'use client'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useMessagesListSheetStore } from '@/store'

type Props = {
  children: React.ReactNode
}
const MessageIdLayout = ({ children }: Props) => {
  const { open } = useMessagesListSheetStore()

  return (
    <div>
      <div className="flex items-center p-4 border-b md:hidden">
        <Button variant="ghost" size="icon" onClick={open} className="text-primary/50">
          <Icon name="list" />
        </Button>
      </div>

      {children}
    </div>
  )
}

export default MessageIdLayout
