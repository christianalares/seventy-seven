import { render } from '@react-email/render'
import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}

export const createResendClient = () => new Resend(process.env.RESEND_API_KEY)
export const componentToPlainText = (component: React.ReactElement) =>
  render(component, {
    plainText: true,
  })
