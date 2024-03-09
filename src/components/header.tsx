'use client'

import { ThemeSelector } from './theme-selector'

export const Header = () => {
  return (
    <header className="p-4 border-b h-20 flex items-center">
      <span className="flex justify-center items-center border-4 -skew-x-12 py-1 px-4 font-bold">77</span>

      <ThemeSelector className="ml-auto" />
    </header>
  )
}
