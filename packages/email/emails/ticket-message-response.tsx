import { Body, Container, Font, Head, Heading, Html, Img, Preview, Tailwind, Text } from '@react-email/components'
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as React from 'react'
import { Footer } from '../components/footer'
import { LastMessages } from '../components/last-messages'
import type { Message } from '../types'

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
  thread: Message[]
}

const TicketMessageResponse = ({ handler, thread }: Props) => {
  console.log({ handler })

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
        <Body className="bg-[#f3f4f6]">
          <Container className="p-4 max-w-4xl bg-white rounded-md">
            {handler.company.image_url ? (
              <Img src={handler.company.image_url} alt="Acme" className="h-16" />
            ) : (
              <Heading as="h1">{handler.company.name}</Heading>
            )}

            <Text className="font-maven-pro text-lg mt-4">
              {handler.name === handler.company.name
                ? `${handler.name} has sent you a response`
                : `${handler.name} from ${handler.company.name} has sent you a response`}
            </Text>

            <LastMessages messages={thread.slice(0, 5)} />
            <Footer />
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
  thread: [
    {
      id: 'e17e73b6-9dd4-4efd-85f9-6c58846c4827',
      body: "Sure, no problem. I've updated your organization settings. You should now be able to update your username. Anything else I can help with?",
      created_at: new Date('2024-03-23T10:39:27.352Z'),
      sent_from_full_name: null,
      sent_from_email: null,
      sent_from_avatar_url: null,
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
      sent_from_full_name: 'Donald Duck',
      sent_from_email: 'christian.alares+donald-duck@gmail.com',
      sent_from_avatar_url: 'https://avatars.githubusercontent.com/u/97747758?v=4',
    },
    {
      id: '603f40bc-1395-4c65-889c-360a4221fcd0',
      body: 'Oh, I see. I might have forgotten to request access for this specific organization 😬',
      created_at: new Date('2024-03-20T16:52:09.000Z'),
      handler: null,
      sent_from_full_name: 'Donald Duck',
      sent_from_email: 'christian.alares+donald-duck@gmail.com',
      sent_from_avatar_url: 'https://avatars.githubusercontent.com/u/97747758?v=4',
    },
    {
      id: '3dd2b444-49b3-4fea-9750-8ecaf2f1f3cd',
      body:
        'Hi Donald!\n' +
        '\n' +
        'It looks like your domain name (duckburg.com) is not listed as a trusted domain. Let me have a look!\n' +
        '\n' +
        'Christian',
      sent_from_full_name: null,
      sent_from_email: null,
      sent_from_avatar_url: null,
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
      sent_from_full_name: 'Donald Duck',
      sent_from_email: 'christian.alares+donald-duck@gmail.com',
      sent_from_avatar_url: 'https://avatars.githubusercontent.com/u/97747758?v=4',
    },
  ],
} satisfies Props

export default TicketMessageResponse
