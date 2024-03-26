import { ConfettiRain } from '@/components/confetti-rain'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
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
  title: '77',
  description: 'The open source alternative to Zendesk',
}

type Props = {
  children: React.ReactNode
}

const RootLayout = async ({ children }: Props) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
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
