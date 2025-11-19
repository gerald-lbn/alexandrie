import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const LoginController = () => import('#authentication/controllers/login_controller')
const LogoutController = () => import('#authentication/controllers/logout_controller')
const RegisterController = () => import('#authentication/controllers/register_controller')
const VerifyAccountController = () =>
  import('#authentication/controllers/verify_account_controller')

router
  .group(() => {
    router.get('', [RegisterController, 'render']).as('register.render')
    router.post('', [RegisterController, 'handle']).as('register.handle')
  })
  .use([middleware.guest()])
  .prefix('/register')

router
  .group(() => {
    router.get('', [LoginController, 'render']).as('login.render')
    router.post('', [LoginController, 'handle']).as('login.handle')
  })
  .use([middleware.guest()])
  .prefix('/login')

router.get('/logout', [LogoutController, 'handle']).use([middleware.auth()]).as('logout.handle')

router
  .group(() => {
    router.get('', [VerifyAccountController, 'render']).as('verify-account.render')
    router.post('', [VerifyAccountController, 'handle']).as('verify-account.handle')
  })
  .use([middleware.auth()])
  .prefix('/verify-account')
