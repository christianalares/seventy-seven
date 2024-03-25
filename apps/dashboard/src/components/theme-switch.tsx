'use client'

import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { Icon, type IconName } from './ui/icon'

const getThemeIcon = (theme?: string): IconName => {
  switch (theme) {
    case 'light':
      return 'sun'
    case 'dark':
      return 'moon'
    case 'system':
      return 'monitor'
    default:
      return 'monitor'
  }
}

type Props = {
  className?: string
}

export const ThemeSwitch = ({ className }: Props) => {
  const { theme, setTheme, themes } = useTheme()
  const themeIconName = getThemeIcon(theme)

  return (
    <div className={cn('flex items-center relative', className)}>
      <select
        className="text-xs border rounded appearance-none pl-6 pr-6 py-1.5 bg-transparent outline-none capitalize w-full"
        value={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>

      <div className="absolute left-2">
        <Icon name={themeIconName} className="size-3" />
      </div>

      <div className="absolute right-2">
        <Icon name="chevronsUpDown" className="size-3" />
      </div>
    </div>
  )
}
