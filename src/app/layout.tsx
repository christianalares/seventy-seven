import { Header } from '@/components/header'
import { AllSheets } from '@/components/sheets/all-sheets'
import { Sidebar } from '@/components/sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { getSession } from '@/utils/supabase/session'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'SjuApp',
  description: 'The open source alternative to Zendesk',
}

type Props = {
  authed: React.ReactNode
  unauthed: React.ReactNode
  children: React.ReactNode
}

const RootLayout = async ({ authed, unauthed, children }: Props) => {
  const session = await getSession()

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn('h-full flex flex-col', inter.className)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {session ? (
            <>
              <AllSheets />
              <Header user={session.user} />

              <div className="flex flex-1">
                <Sidebar className="hidden md:block" />

                <main className="flex-1 flex flex-col">
                  {authed}
                  {children}
                </main>
              </div>
            </>
          ) : (
            <main className="flex-1 flex flex-col">
              {unauthed}
              {children}
            </main>
          )}

          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
