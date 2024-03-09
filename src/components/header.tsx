'use client'

import { MainMenuMobile } from './main-menu-mobile'
import { ThemeSelector } from './theme-selector'

export const Header = () => {
  return (
    <header className="p-4 border-b h-20 flex items-center">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <MainMenuMobile />
        </div>
        <span className="flex justify-center items-center border-4 -skew-x-12 py-1 px-4 font-bold">77</span>
      </div>

      <ThemeSelector className="ml-auto" />
    </header>
  )
}
