import {BaseSchema} from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permis_de_conduires'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('numero', 255).notNullable().unique()
      table.string('categorie', 255).notNullable()
      table.date('date_delivrance').notNullable() // Using date type for dates
      table.date('date_expiration').notNullable() // Using date type for dates
      table.string('document_pdf', 255).nullable() // Assuming file path

      table.integer('conducteur_id').unsigned().references('id').inTable('conducteurs').onDelete('CASCADE').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}