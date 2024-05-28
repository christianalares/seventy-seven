import { CreateSeventySevenTicketButton } from '@/components/create-seventy-seven-ticket-button'
import { PageWrapper } from '@/components/page-wrapper'
import { usersQueries } from '@/queries/users'
import { Button } from '@seventy-seven/ui/button'
import { CodeBlock } from '@seventy-seven/ui/code-block'
import Link from 'next/link'

const HelpPage = async () => {
  const user = await usersQueries.findMe()

  return (
    <PageWrapper className="m-8 [&_p+p]:mt-2">
      <h1 className="text-2xl">Help</h1>
      <h2 className="mt-4 text-xl">Where do I start?</h2>
      <p className="mt-2">So, your inbox is empty and you don't know what to do? Let's get you started!</p>
      <p>
        The way Seventy Seven works is that you are implementing the actual submission from your users. I've given you
        an endpoint that you can use so all you need is a form submission that POSTs to that endpoint. In order to make
        that work you first have to create an authorization token that you'll need to use for that request.
      </p>
      <h2 className="mt-4 text-xl">Step 1</h2>
      <Button asChild>
        <Link href="/settings/security" className="mt-2">
          Create an authorization token
        </Link>
      </Button>
      <hr className="my-8" />
      <h2 className="mt-4 text-xl">Step 2</h2>
      <p className="mt-4">
        So, now you have an authorization token. You can use this token to make a{' '}
        <span className="font-medium">POST</span> request to the "create ticket" endpoint.
      </p>
      <CodeBlock
        className="mt-4 max-h-none"
        tabs={[
          {
            id: 'sdk',
            label: 'SDK',
            code: `// @/lib/seventy-seven.ts
import { SeventySevenClient } from '@seventy-seven/sdk'
            
export const seventySevenClient = new SeventySevenClient(process.env.SEVENTY_SEVEN_AUTH_TOKEN)

// other-file.ts (api route, server action etc...)
import { seventySevenClient } from '@/lib/seventy-seven'

const createdTicket = await seventySevenClient.createTicket({
  subject: 'My first ticket',
  body: 'This is my first ticket, please help me with something',
  senderFullName: 'John Doe',
  senderEmail: '',
})
`,
          },
          {
            id: 'javascript',
            label: 'JavaScript',
            code: `fetch('https://app.seventy-seven.dev/api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: \`Bearer \${process.env.SEVENTY_SEVEN_AUTH_TOKEN}\`,
  },
  body: JSON.stringify({
    subject: 'My first ticket',
    body: 'This is my first ticket, please help me with something',
    senderFullName: 'John Doe',
    senderEmail: 'john@doe.com',
    senderAvatarUrl: 'https://.../avatar.jpg', // Optional field
  }),
})`,
          },
        ]}
      />
      <p className="mt-4">
        <span className="font-semibold">One important note!</span>
        <br />
        Do not use this code in the client since this will expose your auth token to the browser and therefore to your
        users. If you are using Next.js a good fit would be to use it in either a server action or an API route. Using a
        "regular" server framerwork such as Hono, Express or something similar is of course totally fine as long as you
        keep your auth token private.
      </p>
      <h2 className="mt-4 text-xl">Any questions?</h2>
      <p className="mt-4">
        Feel free to hook up on 𝕏 if you have any questions or just want to chat:{' '}
        <a className="text-blue-600" href="https://twitter.com/c_alares" target="_blank" rel="noreferrer">
          @c_alares
        </a>
      </p>
      <p>
        This is a little meta but we actually use Seventy Seven for Seventy Seven so if you have any troubles you can
        <CreateSeventySevenTicketButton user={user}>create a ticket</CreateSeventySevenTicketButton> to get in contact
        with us.
      </p>
    </PageWrapper>
  )
}

export default HelpPage
