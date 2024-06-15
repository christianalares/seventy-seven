import { OpenpanelProvider, OpenpanelSdk } from '@openpanel/nextjs'
import { waitUntil } from '@vercel/functions'

export { setProfile } from '@openpanel/nextjs'

export const createAnalyticsClient = ({ clientId, clientSecret }: { clientId: string; clientSecret: string }) => {
  const openpanelClient = new OpenpanelSdk({ clientId, clientSecret })

  const event = async (...args: Parameters<OpenpanelSdk['event']>) => {
    if (process.env.NODE_ENV === 'development') {
      // biome-ignore lint/suspicious/noConsoleLog: Should only log in development
      console.log('openpanelClient.event', args)
      return null
    }

    return waitUntil(openpanelClient.event(...args))
  }

  return {
    ...openpanelClient,
    event,
  }
}

export const AnalyticsProvider = ({ clientId }: { clientId: string }) => {
  return (
    <OpenpanelProvider
      clientId={clientId}
      trackScreenViews={process.env.NODE_ENV === 'production'}
      trackOutgoingLinks={process.env.NODE_ENV === 'production'}
    />
  )
}
