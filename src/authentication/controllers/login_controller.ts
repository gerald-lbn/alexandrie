import AuthenticationService from '#authentication/services/authentication_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class LoginController {
  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Renders the login form
   */
  render({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Handles the form submission
   */
  async handle({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    return await this.authenticationService.login(email, password)
  }
}
