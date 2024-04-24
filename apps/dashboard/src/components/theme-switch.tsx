'use client'

import { Icon, type IconName } from '@seventy-seven/ui/icon'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@seventy-seven/ui/select'
import { cn } from '@seventy-seven/ui/utils'
import { useTheme } from 'next-themes'

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
      <Select value={theme} onValueChange={(newTheme) => setTheme(newTheme)}>
        <SelectTrigger className="h-full">
          <span className="w-full !flex items-center capitalize gap-2">
            <Icon name={themeIconName} className="size-4" />
            <SelectValue placeholder="Select theme" className="bg-red-100 border-4 border-red-400" />
          </span>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme} className="capitalize">
                {theme}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
