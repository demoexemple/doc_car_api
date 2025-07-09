// Assurance.ts
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import Vehicule from './Vehicule.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Assurance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numeroContrat: string

  @column()
  declare companie: string

  @column()
  declare dateDebut: Date

  @column()
  declare dateExpiration: Date

  @column()
  declare documentPdf: string

  @column()
  declare vehiculeId: number

  @belongsTo(() => Vehicule)
  declare vehicule: BelongsTo<typeof Vehicule>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null


    @computed()
    get isValid(): boolean {
      return this.dateExpiration > new Date()
    }
}