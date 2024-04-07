import { Column, Img, Link, Row, Section } from '@react-email/components'

const baseUrl =
  process.env.VERCEL_ENV === 'production' ? 'https://seventy-seven.dev/email/' : 'http://localhost:3001/email'

export const Footer = () => {
  return (
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
  )
}
