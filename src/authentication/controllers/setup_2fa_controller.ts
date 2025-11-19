import AuthenticationService from '#authentication/services/authentication_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class Setup2FAController {
  constructor(private authenticationService: AuthenticationService) {}

  render({ auth, inertia, response }: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.redirect().toRoute('login.render')
    }
    if (user.twoFactorAuthSetup) {
      return response.redirect().toRoute('home.render')
    }

    const { qrCode, encodedTotp } = this.authenticationService.setup2FA(user)

    return inertia.render('auth/setup_2fa', {
      qrCode,
      encodedTotp,
    })
  }
}
