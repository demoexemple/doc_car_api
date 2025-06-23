import {BaseSchema} from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assurances'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('companie', 255).notNullable()
      table.string('numero_contrat', 255).notNullable().unique()
      table.date('date_debut').notNullable() // Using date type
      table.date('date_expiration').notNullable() // Using date type
      table.string('document_pdf', 255).nullable()

      table.integer('vehicule_id').unsigned().references('id').inTable('vehicules').onDelete('CASCADE').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}