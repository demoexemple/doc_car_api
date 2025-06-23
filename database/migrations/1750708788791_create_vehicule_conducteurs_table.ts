import {BaseSchema} from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vehicule_conducteurs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Optional primary key for the pivot table
      table.integer('vehicule_id').unsigned().references('id').inTable('vehicules').onDelete('CASCADE').notNullable()
      table.integer('conducteur_id').unsigned().references('id').inTable('conducteurs').onDelete('CASCADE').notNullable()
      table.unique(['vehicule_id', 'conducteur_id']) // Ensures a unique pair

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}