import User from '#authentication/models/user'
import { BaseModel, beforeCreate, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomInt } from 'node:crypto'

export default class Otp extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime()
  declare validUntil: DateTime

  @column()
  declare code: string

  @beforeCreate()
  @beforeSave()
  static setValues(otp: Otp) {
    otp.validUntil = DateTime.now().plus({
      minutes: 15,
    })

    otp.code = randomInt(0, 10 ** 6 - 1)
      .toString()
      .padStart(6, '0')
  }
}
