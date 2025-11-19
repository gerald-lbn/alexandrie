import OtpRepository from '#authentication/repositories/otp_repository'
import UserRepository from '#authentication/repositories/user_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

@inject()
export default class AuthenticationService {
  constructor(
    protected ctx: HttpContext,
    private userRepository: UserRepository,
    private otpRepository: OtpRepository
  ) {}

  /**
   * Registers a new user
   * @param fullName the full name of the new user
   * @param email the email of the new user
   * @param password the password of the new user
   */
  async register(fullName: string, email: string, password: string): Promise<void> {
    const user = await this.userRepository.create(fullName, email, password)
    const otp = await this.otpRepository.create(user.id)

    await mail.send((msg) => {
      msg
        .to(user.email)
        .from('info@alexandrie.app')
        .subject('Verify your email address')
        .htmlView('emails/verify_email', { user, otp })
    })

    await this.ctx.auth.use('web').login(user)
    return this.ctx.response.redirect().toRoute('verify-account.render')
  }

  /**
   * Logs in a user
   * @param email the email of the user
   * @param password the password of the user
   */
  async login(email: string, password: string): Promise<void> {
    const user = await this.userRepository.verifyCredentials(email, password)
    if (user) {
      await this.ctx.auth.use('web').login(user)
      if (!user.isVerified) {
        return this.ctx.response.redirect().toRoute('verify-account.render')
      }
      return this.ctx.response.redirect().toRoute('home.render')
    }
    this.ctx.session.flashErrors({
      email: 'Invalid email or password',
      password: 'Invalid email or password',
    })
    return this.ctx.response.redirect().toRoute('login.render')
  }

  /**
   * Log the authenticated user out
   */
  async logout(): Promise<void> {
    if (this.ctx.auth.user) {
      const user = this.ctx.auth.user
      if (user) {
        await this.ctx.auth.use('web').logout()
        return this.ctx.response.redirect().toRoute('login.render')
      }
      return this.ctx.response.redirect().back()
    }
  }

  /**
   * Verify the user input otp against the database
   * @param code the otp input by the user
   */
  async verifyAccount(code: string): Promise<void> {
    const user = this.ctx.auth.user
    if (!user) {
      return this.ctx.response.redirect().toRoute('register.render')
    }

    const verified = await this.otpRepository.verify(user.id, code)
    if (verified) {
      this.otpRepository.delete(user.id)
      await user
        .merge({
          isVerified: true,
        })
        .save()
      await mail.send((msg) => {
        msg
          .to(user.email)
          .from('info@alexandrie.app')
          .subject('Your account is verified')
          .htmlView('emails/verified_email', { user })
      })
      await this.ctx.auth.use('web').login(user)
      return this.ctx.response.redirect().toRoute('home.render')
    }

    this.ctx.session.flashErrors({
      code: 'Wrong verification code',
    })
    return this.ctx.response.redirect().toRoute('verify-account.render')
  }
}
