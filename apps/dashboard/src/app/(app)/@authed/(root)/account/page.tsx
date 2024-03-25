import { PageWrapper } from '@/components/page-wrapper'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@seventy-seven/ui/card'

const AccountPage = async () => {
  return (
    <PageWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how 77 looks on your device</CardDescription>
        </CardHeader>

        <CardContent>
          <ThemeSwitch className="w-44" />
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

export default AccountPage
