import {BaseSchema} from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'carte_bleues'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('numero', 255).notNullable().unique()
      table.string('type_transport', 255).notNullable()
      table.string('nom_exploitant', 255).nullable()
      table.date('date_delivrance').notNullable() // Using date type
      table.date('date_expiration').notNullable() // Using date type
      table.string('photo', 255).nullable() // Assuming file path

      table.integer('vehicule_id').unsigned().references('id').inTable('vehicules').onDelete('CASCADE').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}