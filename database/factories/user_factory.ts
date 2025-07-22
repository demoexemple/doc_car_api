import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {

    const emailvalue=faker.internet.email()
    return {

      fullName: faker.person.fullName(),
      email:emailvalue,
      password:emailvalue,
      role:"admin",
    }
  })
  .build()