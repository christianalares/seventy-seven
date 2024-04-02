import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { cn } from '@seventy-seven/ui/utils'

const baseUrl =
  process.env.VERCEL_ENV === 'production' ? 'https://seventy-seven.dev/email/' : 'http://localhost:3001/email'

type Props = {
  handler: {
    name: string
    company: {
      name: string
      image_url?: string
    }
    avatar?: string
  }
  user: {
    name: string
    avatar?: string
  }
  thread: Array<{
    handler: {
      image_url: string | null
      full_name: string
    } | null
    body: string
    id: string
    created_at: Date
  }>
}

const TicketMessageResponse = ({ handler, user, thread }: Props) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>{`${handler.name} from ${handler.company.name} has sent you a response`}</Preview>

      <title>{`${handler.name} from ${handler.company} has sent you a response`}</title>

      <Tailwind
        config={{
          theme: {
            fontFamily: {
              sans: ['Roboto', 'Verdana', 'sans-serif'],
              'maven-pro': ['Maven Pro', 'sans-serif'],
            },
          },
        }}
      >
        <Body>
          <Container className="p-2 max-w-4xl">
            {handler.company.image_url ? (
              <Img src={handler.company.image_url} alt="Acme" className="h-16" />
            ) : (
              <Heading as="h1">{handler.company.name}</Heading>
            )}

            <Heading as="h2" className="font-maven-pro text-lg flex items-center gap-4 mt-8">
              {handler.name === handler.company.name
                ? `${handler.name} has sent you a response`
                : `${handler.name} from ${handler.company.name} has sent you a response`}
            </Heading>

            {thread.slice(0, 5).map((message, i) => {
              const name = message.handler ? message.handler.full_name : user.name

              let initials = name.substring(0, 2).toUpperCase()

              const [namePart1, namePart2] = name.split(' ')

              if (namePart1 && namePart2) {
                initials = `${namePart1.charAt(0)}${namePart2.charAt(0)}`.toUpperCase()
              }

              const isLastMessage = i === 0

              return (
                <Section
                  key={message.id}
                  className={cn({
                    'mt-4': i > 0,
                    'opacity-50': !isLastMessage,
                  })}
                >
                  {message.handler ? (
                    <Row>
                      <Column width={48}>
                        {message.handler.image_url ? (
                          <Img src={message.handler.image_url} className="w-10 h-10 rounded-full" />
                        ) : (
                          <Text className="bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                            {initials}
                          </Text>
                        )}
                      </Column>
                      <Column className="font-bold">{handler.name}</Column>
                      <Column className="text-xs" align="right">
                        {message.created_at.toLocaleDateString()} - {message.created_at.toLocaleTimeString()}
                      </Column>
                    </Row>
                  ) : (
                    <Row>
                      <Column width={48}>
                        {user.avatar ? (
                          <Img src={user.avatar} className="w-10 h-10 rounded-full" />
                        ) : (
                          <Text className="bg-gray-400 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                            {initials}
                          </Text>
                        )}
                      </Column>
                      <Column className="font-bold">{user.name}</Column>
                      <Column className="text-xs" align="right">
                        {message.created_at.toLocaleDateString()} - {message.created_at.toLocaleTimeString()}
                      </Column>
                    </Row>
                  )}

                  <Row>
                    <Text className="text-base">{message.body}</Text>
                  </Row>

                  <Hr
                    className={cn({
                      'border-t-gray-500 border-t-2': isLastMessage,
                    })}
                  />
                </Section>
              )
            })}

            <Section className="mt-2">
              <Row>
                <Column align="right">
                  <Link href="https://seventy-seven.dev" className="text-gray-400 inline-flex items-center gap-2">
                    Powered by
                    <Img src={`${baseUrl}/77-logo.png`} alt="77" className="w-5 h-5 inline" />
                  </Link>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

TicketMessageResponse.PreviewProps = {
  handler: {
    name: 'Edgar Douglas',
    company: {
      name: 'Acme',
      image_url: `${baseUrl}/acme.png`,
    },
    avatar: `${baseUrl}/avatar.jpg`,
  },
  user: {
    name: 'Donald Duck',
    avatar: 'https://avatars.githubusercontent.com/u/97747758?v=4',
  },
  thread: [
    {
      id: 'e17e73b6-9dd4-4efd-85f9-6c58846c4827',
      body: "Sure, no problem. I've updated your organization settings. You should now be able to update your username. Anything else I can help with?",
      created_at: new Date('2024-03-23T10:39:27.352Z'),
      handler: {
        full_name: 'Christian Alares',
        image_url: 'https://avatars.githubusercontent.com/u/893819?v=4',
      },
    },
    {
      id: '1bf8f4e4-ccf2-4fcd-93f3-a2473f039c0b',
      body: 'Yeah, I just hade a quack look and the domain is not there. Can you fix this on your end?',
      created_at: new Date('2024-03-20T16:53:28.000Z'),
      handler: null,
    },
    {
      id: '603f40bc-1395-4c65-889c-360a4221fcd0',
      body: 'Oh, I see. I might have forgotten to request access for this specific organization 😬',
      created_at: new Date('2024-03-20T16:52:09.000Z'),
      handler: null,
    },
    {
      id: '3dd2b444-49b3-4fea-9750-8ecaf2f1f3cd',
      body:
        'Hi Donald!\n' +
        '\n' +
        'It looks like your domain name (duckburg.com) is not listed as a trusted domain. Let me have a look!\n' +
        '\n' +
        'Christian',
      created_at: new Date('2024-03-20T16:50:15.000Z'),
      handler: {
        full_name: 'Christian Alares',
        image_url: 'https://avatars.githubusercontent.com/u/893819?v=4',
      },
    },
    {
      id: 'f7c61406-cc0d-4057-9527-65c6685c7905',
      body: `Hi! It seems like i can't update me username. I only get the error "Error updating username" and when I click retry, the same error message appears.`,
      created_at: new Date('2024-03-20T16:46:38.000Z'),
      handler: null,
    },
  ],
} satisfies Props

export default TicketMessageResponse
