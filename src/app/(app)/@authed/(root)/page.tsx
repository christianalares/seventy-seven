import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const AuthorizedPage = () => {
  return (
    <div className="m-8">
      <Card>
        <CardHeader>
          <CardTitle>Whats new?</CardTitle>
          <CardDescription>You have 3 incoming tickets</CardDescription>
        </CardHeader>

        <CardContent>
          <ul>
            <li>Ticket 1</li>
            <li>Ticket 2</li>
            <li>Ticket 3</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthorizedPage
