import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useMainMenuSheetStore } from '@/store'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Icon, type IconName } from '../ui/icon'

type MenuItemProps = {
  href: string
  icon: IconName
  label: string
}

const MenuItem = ({ href, icon, label }: MenuItemProps) => {
  const { close } = useMainMenuSheetStore()

  const segment = useSelectedLayoutSegment()
  const isActive = (segment === null && href === '/') || segment === href.substring(1)

  return (
    <li>
      <Link
        onClick={close}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 hover:bg-foreground/5 border border-transparent hover:border-border text-foreground/60 text-sm',
          {
            'bg-foreground/5 border-border text-foreground': isActive,
          },
        )}
        href={href}
      >
        <Icon name={icon} className="size-4" />
        {label}
      </Link>
    </li>
  )
}

export const MainMenuSheet = () => {
  const { isOpen, close } = useMainMenuSheetStore()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent side="left" className="w-[50vw]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          <nav>
            <ul className="flex flex-col gap-2 ">
              <MenuItem href="/" icon="home" label="Overview" />
              <MenuItem href="/inbox" icon="inbox" label="Inbox" />
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
