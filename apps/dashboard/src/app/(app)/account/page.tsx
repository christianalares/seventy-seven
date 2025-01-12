import { EditDisplayNameForm } from '@/components/forms/edit-display-name-form'
import { PageWrapper } from '@/components/page-wrapper'
import { trpc } from '@/trpc/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@seventy-seven/ui/card'
import { Icon } from '@seventy-seven/ui/icon'
import { Skeleton } from '@seventy-seven/ui/skeleton'
import dynamic from 'next/dynamic'

const ThemeSwitch = dynamic(() => import('@/components/theme-switch').then(({ ThemeSwitch }) => ThemeSwitch), {
  ssr: false,
  loading: () => <Skeleton className="w-36 h-8" />,
})

const AccountPage = async () => {
  trpc.users.me.prefetch()

  return (
    <PageWrapper className="space-y-4">
      <EditDisplayNameForm />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="palette" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how Seventy Seven looks on your device</CardDescription>
        </CardHeader>

        <CardContent>
          <ThemeSwitch className="w-36" />
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

export default AccountPage
