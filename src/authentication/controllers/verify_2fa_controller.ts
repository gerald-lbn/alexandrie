import AuthenticationService from '#authentication/services/authentication_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

@inject()
export default class Verify2FAController {
  constructor(private authenticationService: AuthenticationService) {}

  static validation = vine.compile(
    vine.object({
      encodedTotp: vine.string(),
      code: vine.string().fixedLength(6),
    })
  )

  async handle({ request }: HttpContext) {
    console.log(request.all())
    const { encodedTotp, code } = await request.validateUsing(Verify2FAController.validation)

    await this.authenticationService.verify2FA(encodedTotp, code)
  }
}
