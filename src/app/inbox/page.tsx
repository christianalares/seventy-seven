import { Message } from '@/components/message'
import { faker } from '@faker-js/faker'

const messages = Array.from({ length: 8 }, () => ({
  id: faker.string.uuid(),
  from: {
    name: faker.person.fullName(),
    email: faker.internet.email(),
  },
  subject: faker.lorem.sentence({ min: 6, max: 8 }),
  date: faker.date.recent().toString(),
  body: faker.lorem.paragraphs({ min: 1, max: 2 }),
  read: faker.datatype.boolean(),
}))

const InboxPage = () => {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  )
}

export default InboxPage
