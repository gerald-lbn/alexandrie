import UserRepository from '#authentication/repositories/user_repository'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthenticationService {
  constructor(
    protected ctx: HttpContext,
    private userRepository: UserRepository
  ) {}

  /**
   * Registers a new user
   * @param fullName the full name of the new user
   * @param email the email of the new user
   * @param password the password of the new user
   */
  async register(fullName: string, email: string, password: string): Promise<void> {
    const user = await this.userRepository.create(fullName, email, password)
    await this.ctx.auth.use('web').login(user)
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
}
