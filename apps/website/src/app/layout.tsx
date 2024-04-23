import { ConfettiRain } from '@/components/confetti-rain'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { OpenpanelProvider } from '@openpanel/nextjs'
import '@seventy-seven/ui/globals.css'
import { cn } from '@seventy-seven/ui/utils'
import type { Metadata, Viewport } from 'next'
import { Abel, Maven_Pro, Roboto } from 'next/font/google'
import '../app/globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  // light, normal, medium, bold
  weight: ['300', '400', '500', '700'],
  variable: '--roboto',
})

const mavenPro = Maven_Pro({
  subsets: ['latin'],
  variable: '--maven-pro',
})

const abel = Abel({
  subsets: ['latin'],
  weight: '400',
  variable: '--abel',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Seventy Seven - The open source alternative to Zendesk',
  description: 'A modern and simple platform to make customer support extremely easy',
}

type Props = {
  children: React.ReactNode
}

const NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID_CLIENT = process.env.NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID_CLIENT

if (!NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID_CLIENT) {
  throw new Error('NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID_CLIENT is required')
}

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <OpenpanelProvider clientId={NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID_CLIENT} trackScreenViews trackOutgoingLinks />
      <body
        className={cn('h-full flex flex-col', mavenPro.variable, abel.variable, roboto.variable)}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ConfettiRain />
          <Header />

          <main className="py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
