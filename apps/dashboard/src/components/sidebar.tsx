import { usersQueries } from '@/queries/users'
import { cn } from '@seventy-seven/ui/utils'
import { Folders } from './folders'
import { MainMenu } from './main-menu'
import { TeamSelector } from './team-selector'

type Props = {
  className?: string
}

export const Sidebar = async ({ className }: Props) => {
  const user = await usersQueries.findMe()

  return (
    <aside className={cn('border-r p-3 flex flex-col', className)}>
      <MainMenu />
      <Folders className="mt-4 border-t pt-4" />
      <TeamSelector className="mt-auto" user={user} />
    </aside>
  )
}
