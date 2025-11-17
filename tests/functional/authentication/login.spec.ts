import User from '#authentication/models/user'
import { UserFactoryWithStrongPassword } from '#database/factories/user_factory'
import { test } from '@japa/runner'

test.group('Authentication login', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('fails when form is empty', async ({ client, route }) => {
    const req = await client.post(route('login.render')).form({})

    req.assertRedirectsTo(route('login.render'))
  })

  test('fails when only the email is provided', async ({ client, route }) => {
    const user = await UserFactoryWithStrongPassword.create()

    const req = await client.post(route('login.handle')).form({ email: user.email }).withCsrfToken()

    req.assertRedirectsTo(route('login.render'))
  })

  test('fails when only the password is provided', async ({ client, route }) => {
    const user = await UserFactoryWithStrongPassword.create()

    const req = await client
      .post(route('login.handle'))
      .form({
        password: user.password,
      })
      .withCsrfToken()

    req.assertRedirectsTo(route('login.render'))
  })

  test('succeeds when the right email and password are provided²', async ({ client, route }) => {
    const user = await UserFactoryWithStrongPassword.create()

    const res = await client
      .post(route('login.handle'))
      .form({
        email: user.email,
        password: user.password,
      })
      .withCsrfToken()
      .loginAs(user)

    res.assertRedirectsTo(route('/'))
  })
})
