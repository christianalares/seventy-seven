import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as React from 'react'
import { Footer } from '../components/footer'
import { LastMessages } from '../components/last-messages'
import type { Message } from '../types'

const baseUrl =
  process.env.VERCEL_ENV === 'production' ? 'https://seventy-seven.dev/email/' : 'http://localhost:3001/email'

type Props = {
  shortId: string
  subject: string
  thread: Message[]
  ticketUrl: string
}

const TicketMessageResponse = ({ shortId, subject, thread, ticketUrl }: Props) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="MavenPro"
          fallbackFontFamily="sans-serif"
          webFont={{
            url: 'https://fonts.gstatic.com/s/mavenpro/v33/7Auup_AqnyWWAxW2Wk3swUz56MS91Eww8fvx5nA.ttf',
            format: 'truetype',
          }}
          fontWeight={400}
          fontStyle="normal"
        />

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

      <Preview>Snoozed ticket alert! #{shortId}</Preview>

      <title>Snoozed ticket alert! #{shortId}</title>

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
            <Img src={`${baseUrl}/77-logo.png`} alt="77" className="w-12" />

            <Text className="font-maven-pro text-2xl">Snoozed ticket was due</Text>

            <Text className="font-maven-pro text-lg flex items-center gap-4 mb-0 mt-8">{subject}</Text>

            <Section className="mb-12">
              <Row>
                <Button href={ticketUrl} className="border border-solid rounded-md text-black py-2 px-3 mt-4">
                  Go to ticket
                </Button>
              </Row>
            </Section>

            <LastMessages messages={thread} />

            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

TicketMessageResponse.PreviewProps = {
  shortId: 'g11on82o65',
  subject: 'This is the subject of the email',
  ticketUrl: 'https://seventy-seven.dev/inbox/5f1634a6-358e-42dd-8875-e38b383b35da',
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
      created_at: new Date('2024-03-20T16:50:15.000Z'),
      sent_from_full_name: null,
      sent_from_email: null,
      sent_from_avatar_url: null,
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
