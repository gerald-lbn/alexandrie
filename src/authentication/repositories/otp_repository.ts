import Otp from '#authentication/models/otp'

/**
 * Repository to manage the Otp model
 */
export default class OtpRepository {
  /**
   * Creates a otp for the user
   * @param userId the id of the user
   * @returns the new otp bound to the user
   */
  async create(userId: number): Promise<Otp> {
    const otp = Otp.create({ userId })
    return otp
  }

  /**
   * Verifies the otp
   * @param userId the id of the user
   * @param code the code entered byt the user
   * @returns true if the code entered match the otp, false otherwise
   */
  async verify(userId: number, code: string): Promise<boolean> {
    const [otp] = await Otp.query().where('user_id', userId).where('code', code).limit(1)
    return !!otp
  }

  /**
   * Delete otp generated for the user
   * @param userId the user whose OTPs you want to delete
   */
  async delete(userId: number): Promise<void> {
    await Otp.query().where('user_id', userId).delete()
  }
}
