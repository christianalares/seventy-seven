import { parse } from 'node-html-parser'

export const parseIncomingMessage = (text: string, html: string) => {
  const parsedHtmlBody = parse(html)
  // If the mail was sent using Gmail, postmark will include irrelevant HTML in the body
  // So we try to prase it and get the content from the first div with dir="ltr" attribute
  const maybeContent = parsedHtmlBody.querySelector('div[dir="ltr"]')?.innerText

  if (maybeContent) {
    return maybeContent
  }

  // The body can sometimes include a date signature that we don't want.
  // Example: Hello World!\n\nDen tors 23 maj 2024 kl 13:37 skrev Christian Alares
  if (text.includes('\n\nDen')) {
    const trimmedText = text.split('\n\nDen')[0]

    if (trimmedText) {
      return trimmedText
    }
  }

  return text
}
