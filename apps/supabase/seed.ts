import { faker } from '@faker-js/faker'
import { type Prisma, prisma } from '@seventy-seven/orm/prisma'
import { type UserResponse, createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const clearDatabase = async () => {
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    throw error
  }

  try {
    const deleteAllUsers = data.users.map((user) => supabase.auth.admin.deleteUser(user.id))
    await Promise.all(deleteAllUsers)
  } catch (error) {
    console.error(error)
  }

  await prisma.ticketTagOnTicket.deleteMany()
  await prisma.message.deleteMany()
  await prisma.ticket.deleteMany()
  await prisma.ticketTag.deleteMany()
  await prisma.teamInvite.deleteMany()
  await prisma.userOnTeam.deleteMany()
  await prisma.integrationSlack.deleteMany()

  await prisma.user.deleteMany()
  await prisma.team.deleteMany()

  await prisma.waitlist.deleteMany()

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log('✅ Database cleared')
}

const createUsers = async () => {
  const NUMBER_OF_RANDOM_USERS = 4

  const users = [
    {
      email: 'christian.alares@gmail.com',
      email_confirm: true,
      role: 'authenticated',
      app_metadata: {
        provider: 'github',
        providers: ['github'],
      },
      user_metadata: {
        iss: 'https://api.github.com',
        sub: '893819',
        name: 'Christian Alares',
        email: 'christian.alares@gmail.com',
        full_name: 'Christian Alares',
        user_name: 'christianalares',
        avatar_url: 'https://avatars.githubusercontent.com/u/893819?v=4',
        provider_id: '893819',
        email_verified: true,
        phone_verified: false,
        preferred_username: 'christianalares',
      },
    },
    ...new Array(NUMBER_OF_RANDOM_USERS).fill(null).map(() => {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const email = faker.internet.email()

      return {
        email,
        email_confirm: true,
        role: 'authenticated',
        user_metadata: {
          name: `${firstName} ${lastName}`,
          email,
          full_name: `${firstName} ${lastName}`,
          user_name: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
          avatar_url: `https://i.pravatar.cc/150?u=${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
          email_verified: true,
          phone_verified: false,
          preferred_username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
        },
      }
    }),
  ]

  const createdUsers = await Promise.all(users.map((user) => supabase.auth.admin.createUser(user)))

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`✅ ${createdUsers.length} users created`)

  return createdUsers
}

const createTicketsForFirstUser = async (firstUser: UserResponse | undefined) => {
  const dbUser = await prisma.user.findFirst({
    where: {
      id: firstUser?.data.user?.id,
    },
  })

  if (!dbUser) {
    throw new Error('User not found')
  }

  const foundTeam = await prisma.team.findFirst({
    where: {
      members: {
        some: {
          user_id: dbUser.id,
        },
      },
    },
  })

  if (!foundTeam) {
    throw new Error('Team not found')
  }

  const tickets: Prisma.TicketCreateArgs[] = new Array(10).fill(null).map(() => {
    const sender = {
      full_name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar_url: faker.image.avatar(),
    }

    return {
      data: {
        team_id: foundTeam.id,
        short_id: faker.string.nanoid(10),
        subject: faker.lorem.sentence(),
        messages: {
          createMany: {
            data: [
              {
                body: faker.lorem.paragraph(),
                sent_from_full_name: sender.full_name,
                sent_from_email: sender.email,
                sent_from_avatar_url: sender.avatar_url,
                created_at: new Date(),
              },
              {
                body: faker.lorem.paragraph(),
                handler_id: dbUser.id,
                created_at: new Date(Date.now() + 1000 * 60 * 60 * 1.2), // 1.2 hours after the first message
              },
              {
                body: faker.lorem.paragraph(),
                sent_from_full_name: sender.full_name,
                sent_from_email: sender.email,
                sent_from_avatar_url: sender.avatar_url,
                created_at: new Date(Date.now() + 1000 * 60 * 60 * 6.5), // 6.5 hours after the first message
              },
              {
                body: faker.lorem.paragraph(),
                handler_id: dbUser.id,
                created_at: new Date(Date.now() + 1000 * 60 * 60 * 6.8), // 6.8 hours after the first message
              },
            ],
          },
        },
      },
    }
  })

  const createdTickets = await Promise.all(tickets.map((ticket) => prisma.ticket.create(ticket)))

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`✅ ${createdTickets.length} tickets created`)

  return createdTickets
}

const createNewTeam = async (firstUser: UserResponse | undefined, secondUser: UserResponse | undefined) => {
  const firstDbUser = await prisma.user.findFirst({
    where: {
      id: firstUser?.data.user?.id,
    },
  })

  const secondDbUser = await prisma.user.findFirst({
    where: {
      id: secondUser?.data.user?.id,
    },
  })

  if (!firstDbUser || !secondDbUser) {
    throw new Error('User not found')
  }

  const createdTeam = await prisma.team.create({
    data: {
      name: faker.company.name(),
      members: {
        createMany: {
          data: [
            {
              user_id: firstDbUser.id,
              role: 'OWNER',
            },
            {
              user_id: secondDbUser.id,
              role: 'MEMBER',
            },
          ],
        },
      },
      tickets: {
        createMany: {
          data: new Array(4).fill(null).map(() => ({
            short_id: faker.string.nanoid(10),
            subject: faker.lorem.sentence(),
            created_at: new Date(),
            assigned_to_user_id:
              Math.random() > 0.3 ? secondDbUser.id : Math.random() > 0.6 ? firstDbUser.id : undefined,
          })),
        },
      },
    },
    include: {
      tickets: true,
    },
  })

  await prisma.message.createMany({
    data: createdTeam.tickets.map((ticket) => ({
      body: faker.lorem.paragraph(),
      ticket_id: ticket.id,
      sent_from_full_name: faker.person.fullName(),
      sent_from_email: faker.internet.email(),
      sent_from_avatar_url: faker.image.avatar(),
      created_at: new Date(),
    })),
  })

  // biome-ignore lint/suspicious/noConsoleLog: <explanation>
  console.log(`✅ Team created with ${createdTeam.tickets.length} tickets`)

  return createdTeam
}

export const main = async () => {
  await clearDatabase()

  const createdUsers = await createUsers()

  await createTicketsForFirstUser(createdUsers[0])
  await createNewTeam(createdUsers[0], createdUsers[1])
}

main()
