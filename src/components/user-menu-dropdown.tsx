'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import type { Session } from '@supabase/supabase-js'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Icon, type IconName } from './ui/icon'

type Props = {
  user: Session['user']
  className?: string
}

export const UserMenuDropdown = ({ user, className }: Props) => {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
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
          <p className="text-dark-gray text-xs font-normal">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/me">Settings</Link>
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

const getThemeIcon = (theme?: string): IconName => {
  switch (theme) {
    case 'dark':
      return 'moon'
    case 'system':
      return 'monitor'
    default:
      return 'sun'
  }
}

const ThemeSwitch = () => {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="flex items-center relative">
      <select
        className="text-xs border rounded appearance-none pl-6 pr-6 py-1.5 bg-transparent outline-none capitalize"
        defaultValue={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>

      <div className="absolute left-2">
        <Icon name={getThemeIcon(theme)} className="size-3" />
      </div>

      <div className="absolute right-2">
        <Icon name="chevronsUpDown" className="size-3" />
      </div>
    </div>
  )
}
