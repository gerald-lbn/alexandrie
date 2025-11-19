import Otp from '#authentication/models/otp'
import User from '#authentication/models/user'
import { OtpFactory } from '#database/factories/otp_factory'
import { UserFactoryWithStrongPassword } from '#database/factories/user_factory'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Authentication OneTimePassword', (group) => {
  group.each.setup(async () => {
    await Otp.query().delete()
    await User.query().delete()
  })

  group.each.teardown(async () => {
    await Otp.query().delete()
    await User.query().delete()
  })

  test('sets validUntil to 15 minutes from now', async ({ assert }) => {
    const user = await UserFactoryWithStrongPassword.create()

    const before = DateTime.now()
    const otp = await OtpFactory.make()
    otp.merge({ userId: user.id }).save()
    const after = DateTime.now()

    assert.assert(
      otp.validUntil >= before.plus({ minutes: 15 }) &&
        otp.validUntil <= after.plus({ minutes: 15 }),
      `validUntil (${otp.validUntil.toISO()}) is not 15 minutes in the future`
    )
  })

  test('code has 6 digits', async ({ assert }) => {
    const user = await UserFactoryWithStrongPassword.create()
    const otp = await new Otp()
      .merge({
        userId: user.id,
      })
      .save()

    assert.lengthOf(otp.code, 6)
  })
})
