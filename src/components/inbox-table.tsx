import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

type Message = {
  id: string
  from: {
    name: string
    email: string
  }
  subject: string
  date: string
  body: string
  read: boolean
}

type Props = {
  messages: Message[]
}

export const InboxTable = ({ messages }: Props) => {
  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <p>{message.from.name}</p>
                <p>{message.from.email}</p>
              </TableCell>
              <TableCell>{message.subject}</TableCell>
              <TableCell>
                <p className="max-w-[600px] truncate">{message.body}</p>
              </TableCell>
              <TableCell>{message.read.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
