import RegisterService from '#authentication/services/authentication_service'
import { unique } from '#core/helpers/validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class RegisterController {
  constructor(private registerService: RegisterService) {}

  static validation = vine.compile(
    vine.object({
      fullName: vine.string().minLength(2).maxLength(32).trim(),
      email: vine.string().email().unique(unique('users', 'email')).trim(),
      password: vine.string().minLength(8),
    })
  )

  /**
   * Renders the registration form
   */
  render({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Handles the form submission
   */
  async handle({ request }: HttpContext) {
    const payload = await request.validateUsing(RegisterController.validation)

    await this.registerService.register(payload.fullName, payload.email, payload.password)
  }
}
