import { PageWrapper } from '@/components/page-wrapper'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AccountPage = async () => {
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how SjuApp looks on your device</CardDescription>
        </CardHeader>

        <CardContent>
          <ThemeSwitch className="w-44" />
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

export default AccountPage
