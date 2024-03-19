'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import type { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeSwitch } from './theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Props = {
  user: Session['user']
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

  const fullnameParts = user.user_metadata.full_name.split(' ')
  let initials = fullnameParts[0].charAt(0).toUpperCase()

  if (fullnameParts.length >= 2) {
    initials = (fullnameParts[0].charAt(0) + fullnameParts[fullnameParts.length - 1].charAt(0)).toUpperCase()
  }

  if (fullnameParts.length === 1) {
    initials = `${fullnameParts[0].charAt(0).toUpperCase()}${fullnameParts[0].charAt(1).toUpperCase()}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn('rounded-full', className)}>
        <Avatar>
          <AvatarImage src={user.user_metadata.avatar_url} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          {user.user_metadata.full_name}
          <p className="text-muted-foreground text-xs font-normal">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>

        <div className="flex flex-row justify-between items-center p-2">
          <p className="text-sm">Theme</p>
          <ThemeSwitch />
        </div>

        <DropdownMenuItem onClick={() => handleSignOut()}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
