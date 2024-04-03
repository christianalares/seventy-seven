'use client'

import { cn } from '@seventy-seven/ui/utils'
import { Folders } from './folders'
import { MainMenu } from './main-menu'

type Props = {
  className?: string
}

export const Sidebar = ({ className }: Props) => {
  return (
    <aside className={cn('border-r p-3', className)}>
      <MainMenu />
      <Folders className="mt-4 border-t pt-4" />
    </aside>
  )
}
