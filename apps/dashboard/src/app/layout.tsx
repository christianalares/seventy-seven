import { ThemeProvider } from '@/components/theme-provider'
import '@seventy-seven/ui/globals.css'
import { cn } from '@seventy-seven/ui/utils'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const conWarn = console.warn
const conLog = console.log

const IGNORE_WARNINGS = [
  'Using supabase.auth.getSession() is potentially insecure',
  'Using the user object as returned from supabase.auth.getSession()',
]

// biome-ignore lint/complexity/useArrowFunction: <explanation>
console.warn = function (...args) {
  const match = args.find((arg) =>
    typeof arg === 'string' ? IGNORE_WARNINGS.find((warning) => arg.includes(warning)) : false,
  )
  if (!match) {
    conWarn(...args)
  }
}

// biome-ignore lint/complexity/useArrowFunction: <explanation>
console.log = function (...args) {
  const match = args.find((arg) =>
    typeof arg === 'string' ? IGNORE_WARNINGS.find((warning) => arg.includes(warning)) : false,
  )
  if (!match) {
    conLog(...args)
  }
}

const inter = Inter({ subsets: ['latin'] })

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
      <body className={cn('h-full flex flex-col', inter.className)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
