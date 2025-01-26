// import { deepseek } from '@ai-sdk/deepseek'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export const parseIncomingMessageWithAI = async (html: string) => {
  const model = openai('gpt-3.5-turbo')

  const { text } = await generateText({
    model,
    prompt: `You are a helpful assistant that can parse an incoming messages from a customer.

The message is in HTML format and can differ depending on the email provider.
The input will be a string and here is an example of the input:

<html><body><div dir=\"ltr\">\n    yes, hello!!</div>\n<br>\n<div class=\"gmail_quote\">\n    <div dir=\"ltr\" class=\"gmail_attr\">On 15 Jan 2025 at 23:07:53, Christian Alares from Seventy Seven &lt;<a href=\"mailto:seventy-seven@seventy-seven.dev\">seventy-seven@seventy-seven.dev</a>&gt; wrote:<br></div>\n    \n</div></body></html>\n

In this case it should return:
yes, hello!!

Sometimes it could include other irrelavant markup or content than just that message so I need you do parse it and return that message.

Make sure to only return the message and nothing else.

Here is the html:
${html}`,
  })

  return text
}
