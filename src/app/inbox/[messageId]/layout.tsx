import { MessagesList } from '@/components/messages-list'
import { Icon } from '@/components/ui/icon'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

type Props = {
  children: React.ReactNode
}
const MessageIdLayout = ({ children }: Props) => {
  return (
    <div>
      <div className="flex items-center p-4 border-b md:hidden">
        <Sheet>
          <SheetTrigger>
            <Icon name="panelRightOpen" className="size-6 text-muted" />
          </SheetTrigger>

          <SheetContent side="left" className="overflow-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Messages</SheetTitle>
            </SheetHeader>

            <div className="mt-8">
              <MessagesList />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {children}
    </div>
  )
}

export default MessageIdLayout
