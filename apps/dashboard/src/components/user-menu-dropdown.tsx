'use client'

import { Avatar } from '@/components/avatar'
import { cn } from '@/lib/utils'
import type { UsersFindMe } from '@/queries/users'
import { createClient } from '@seventy-seven/supabase/clients/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@seventy-seven/ui/dropdown-menu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeSwitch } from './theme-switch'

type Props = {
  user: UsersFindMe
  className?: string
}

export const UserMenuDropdown = ({ user, className }: Props) => {
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
          <Link href="/account">Account</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/account/teams">Teams</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="flex flex-row justify-between items-center px-2 py-1">
          <p className="text-sm">Theme</p>
          <ThemeSwitch />
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleSignOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
