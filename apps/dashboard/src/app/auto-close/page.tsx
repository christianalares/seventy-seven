'use client'

import { useEffect } from 'react'

const AutoClosePage = () => {
  useEffect(() => {
    if (!window) {
      return
    }

    window.close()
  }, [])

  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <p>All done, you can close this window!</p>
    </div>
  )
}

export default AutoClosePage
