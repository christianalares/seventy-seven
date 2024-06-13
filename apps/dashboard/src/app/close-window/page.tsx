'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const CloseWindowPage = () => {
  const params = useSearchParams()

  useEffect(() => {
    if (!window) {
      return
    }

    const event = params.get('event')

    if (event) {
      window.opener.postMessage(event, '*')
    }
  }, [params])

  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <p>All done, you can close this window!</p>
    </div>
  )
}

export default CloseWindowPage
