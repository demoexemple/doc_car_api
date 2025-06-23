import {BaseSchema} from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conducteurs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('prenom', 255).notNullable()
      table.string('nom', 255).notNullable()
      table.string('adresse', 255).nullable()
      table.string('telephone', 255).notNullable()
      table.string('num_cni', 255).notNullable().unique()
      table.string('front_cni', 255).nullable() // Assuming file paths
      table.string('back_cni', 255).nullable()  // Assuming file paths
      table.string('profil_image', 255).nullable() // Assuming file paths

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}