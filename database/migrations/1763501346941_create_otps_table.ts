import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'otps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade')
      table.timestamp('valid_until').notNullable()
      table.string('code', 6).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
