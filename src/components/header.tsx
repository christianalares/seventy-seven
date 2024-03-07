'use client'

import { useTheme } from 'next-themes'

export const Header = () => {
  const { setTheme } = useTheme()

  return (
    <header className="p-4 border-b">
      <div className="flex items-center">
        <span>plzhelp</span>

        <div className="flex gap-2 ml-auto">
          <button className="border p-2" type="button" onClick={() => setTheme('light')}>
            Light
          </button>
          <button className="border p-2" type="button" onClick={() => setTheme('dark')}>
            Dark
          </button>
          <button className="border p-2" type="button" onClick={() => setTheme('system')}>
            System
          </button>
        </div>
      </div>
    </header>
  )
}
