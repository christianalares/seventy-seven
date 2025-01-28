import { Button } from '@seventy-seven/ui/button'
import { Icon } from '@seventy-seven/ui/icon'
import { pushSheet } from './sheets'

export const TicketInfoButton = () => {
  return (
    <Button size="icon" variant="secondary" onClick={() => pushSheet('ticketInfoSheet')}>
      <span className="sr-only">Ticket info</span>
      <Icon name="info" className="size-4" />
    </Button>
  )
}
