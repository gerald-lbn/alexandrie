import User from '#authentication/models/user'
import factory from '@adonisjs/lucid/factories'

export const UserFactoryWithStrongPassword = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12, pattern: /[a-zA-Z0-9]/ }),
    }
  })
  .build()

export const UserFactoryWithWeakPassword = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 4 }),
    }
  })
  .build()

export const UserFactoryWithNoPassword = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    }
  })
  .build()
