import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicules'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('voler')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('voler')
    })
  }
}