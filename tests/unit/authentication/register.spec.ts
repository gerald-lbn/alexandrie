import User from '#authentication/models/user'
import {
  UserFactoryWithNoPassword,
  UserFactoryWithStrongPassword,
} from '#database/factories/user_factory'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('creating a user', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('hashes user password', async ({ assert }) => {
    const user = await UserFactoryWithNoPassword.make()
    user.password = 'password'

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'password'))
  })

  test('set the user has unverified', async ({ assert }) => {
    const user = await UserFactoryWithStrongPassword.create()

    assert.isFalse(user.isVerified)
  })
})
