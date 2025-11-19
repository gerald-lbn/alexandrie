import Otp from '#authentication/models/otp'
import factory from '@adonisjs/lucid/factories'

export const OtpFactory = factory
  .define(Otp, async ({ faker }) => {
    return {
      code: faker.string.numeric(6),
    }
  })
  .build()
