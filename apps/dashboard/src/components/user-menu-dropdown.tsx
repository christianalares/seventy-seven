'use client'

import { Avatar } from '@/components/avatar'
import { trpc } from '@/trpc/client'
import { createClient } from '@seventy-seven/supabase/clients/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import { cn } from '@seventy-seven/ui/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeSwitch } from './theme-switch'

type Props = {
  className?: string
}

export const UserMenuDropdown = ({ className }: Props) => {
  const [user] = trpc.users.me.useSuspenseQuery()

  const router = useRouter()
  const sb = createClient()

  const handleSignOut = async () => {
    await sb.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const fullnameParts = user.full_name.split(' ')
  // @ts-ignore
  let initials = fullnameParts[0].charAt(0).toUpperCase()

  if (fullnameParts.length >= 2) {
    // @ts-ignore
    initials = (fullnameParts[0].charAt(0) + fullnameParts[fullnameParts.length - 1].charAt(0)).toUpperCase()
  }

  if (fullnameParts.length === 1) {
    // @ts-ignore
    initials = `${fullnameParts[0].charAt(0).toUpperCase()}${fullnameParts[0].charAt(1).toUpperCase()}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('rounded-full', className)}>
        <Avatar name={initials} imageUrl={user.image_url ?? undefined} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          {user.full_name}
          <p className="text-muted-foreground text-xs font-normal">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link prefetch href="/account">
            Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link prefetch href="/account/teams">
            Teams
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="flex flex-row justify-between items-center px-2 py-1">
          <p className="text-sm">Theme</p>
          <ThemeSwitch className="w-28 h-8" />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleSignOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
