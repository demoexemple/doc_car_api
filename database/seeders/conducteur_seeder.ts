import { ConducteurFactory } from '#database/factories/conducteur_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await ConducteurFactory.createMany(5)
  }
}