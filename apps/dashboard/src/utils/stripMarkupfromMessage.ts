import { parse } from 'node-html-parser'

export const stripMarkupfromMessage = (html: string) => {
  const parsedHtml = parse(html)

  const strippedTagNames = [
    'blockquote',
    'style',
    'script',
    'noscript',
    'iframe',
    'object',
    'embed',
    'applet',
    'base',
    'link',
    'meta',
    'title',
    'head',
  ]

  parsedHtml.querySelectorAll('*').forEach((el) => {
    if (strippedTagNames.includes(el.tagName.toLowerCase())) {
      el.remove()
    }
  })

  return parsedHtml.toString()
}
