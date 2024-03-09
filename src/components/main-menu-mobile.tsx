import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './sidebar'
import { Icon } from './ui/icon'

export const MainMenuMobile = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Icon name="menu" className="size-6" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[50vw]">
        <Sidebar inDrawer />
      </SheetContent>
    </Sheet>
  )
}
