import { ThemeProvider } from '@/components/theme-provider'
import { AnalyticsProvider } from '@seventy-seven/analytics'
import '@seventy-seven/ui/globals.css'
import { cn } from '@seventy-seven/ui/utils'
import type { Metadata, Viewport } from 'next'
import { Maven_Pro, Roboto } from 'next/font/google'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://seventy-seven.dev'),
  title: {
    default: 'Seventy Seven | The open source alternative to Zendesk',
    template: '%s | Seventy Seven',
  },
  description: 'A modern and simple platform to make customer support extremely easy',
}

const mavenPro = Maven_Pro({
  subsets: ['latin'],
  variable: '--maven-pro',
})

const roboto = Roboto({
  subsets: ['latin'],
  // light, normal, medium, bold
  weight: ['300', '400', '500', '700'],
  variable: '--roboto',
})

type Props = {
  children: React.ReactNode
}

const NEXT_PUBLIC_OPENPANEL_DASHBOARD_CLIENT_ID = process.env.NEXT_PUBLIC_OPENPANEL_DASHBOARD_CLIENT_ID

if (!NEXT_PUBLIC_OPENPANEL_DASHBOARD_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_OPENPANEL_DASHBOARD_CLIENT_ID is required')
}

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <AnalyticsProvider clientId={NEXT_PUBLIC_OPENPANEL_DASHBOARD_CLIENT_ID} />

      <body className={cn('h-full flex flex-col', roboto.variable, mavenPro.variable)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
