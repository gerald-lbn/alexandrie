import User from '#authentication/models/user'
import {
  UserFactoryWithStrongPassword,
  UserFactoryWithWeakPassword,
} from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('Authentication register', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('fails when form is empty', async ({ assert, client, route }) => {
    await client.post(route('register.handle')).form({}).withCsrfToken()

    const users = await User.all()
    assert.isEmpty(users)
  })

  test('fails when email is invalid', async ({ assert, client, route }) => {
    await client.post(route('register.handle')).form({ email: 'invalid-email' }).withCsrfToken()

    const users = await User.all()
    assert.isEmpty(users)
  })

  test('fails when email is already taken', async ({ assert, client, route }) => {
    const existingUser = await UserFactoryWithStrongPassword.create()

    await client.post(route('register.handle')).form({ email: existingUser.email }).withCsrfToken()

    const users = await User.all()
    assert.lengthOf(users, 1)
  })

  test('fails if password is too short', async ({ assert, client, route }) => {
    const user = await UserFactoryWithWeakPassword.make()

    await client
      .post(route('register.handle'))
      .form({ email: user.email, password: user.password })
      .withCsrfToken()

    const users = await User.all()
    assert.isEmpty(users)
  })

  test('fails if full name is too short', async ({ assert, client, route }) => {
    const user = await UserFactoryWithStrongPassword.make()

    await client
      .post(route('register.handle'))
      .form({ fullName: 'J', email: user.email, password: user.password })
      .withCsrfToken()

    const users = await User.all()
    assert.isEmpty(users)
  })

  test('fails if full name is too long', async ({ assert, client, route }) => {
    const user = await UserFactoryWithStrongPassword.make()

    await client
      .post(route('register.handle'))
      .form({
        fullName: 'SuperLongNameThatIs32CharactersLong',
        email: user.email,
        password: user.password,
      })
      .withCsrfToken()

    const users = await User.all()
    assert.isEmpty(users)
  })

  test('succeeds when full name, email and password are valid', async ({
    assert,
    client,
    route,
  }) => {
    const user = await UserFactoryWithStrongPassword.make()

    const req = await client
      .post(route('register.handle'))
      .form({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      })
      .withCsrfToken()

    const users = await User.all()
    assert.lengthOf(users, 1)
    assert.isNotNull(users[0].id)
    assert.equal(users[0].fullName, user.fullName)
    assert.equal(users[0].email, user.email)

    req.assertRedirectsTo(route('verify-account.render'))
  })
})
