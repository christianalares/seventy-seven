export type CreateTicketPayload<TMeta> = {
  subject: string
  body: string
  senderFullName: string
  senderEmail: string
  senderAvatarUrl?: string
  meta?: TMeta
}

export type CreateTicketResponse<TMeta = undefined> = TMeta extends undefined
  ? {
      id: string
      subject: string
    }
  : {
      id: string
      subject: string
      meta: TMeta
    }

export class SeventySevenClient {
  #authToken: string

  constructor(authToken: string) {
    this.#authToken = authToken
  }

  async createTicket<TMeta = undefined>(ticket: CreateTicketPayload<TMeta>) {
    try {
      const response = await fetch('https://app.seventy-seven.dev/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.#authToken}`,
        },
        body: JSON.stringify({
          subject: ticket.subject,
          body: ticket.body,
          senderFullName: ticket.senderFullName,
          senderEmail: ticket.senderEmail,
          senderAvatarUrl: ticket.senderAvatarUrl,
          meta: ticket.meta ?? undefined,
        }),
      })

      const createdTicket = await response.json()
      return createdTicket as CreateTicketResponse<TMeta>
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }

      throw new Error('An error occurred while creating ticket')
    }
  }
}
