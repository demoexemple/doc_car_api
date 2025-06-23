// Assurance.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Vehicule from './Vehicule.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Assurance extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare companie: string

  @column()
  declare numeroContrat: string

  @column() // Changed to column.date()
  declare dateDebut: Date

  @column() // Changed to column.date()
  declare dateExpiration: Date

  @column()
  declare documentPdf: string

  @belongsTo(() => Vehicule)
  declare vehicule: BelongsTo<typeof Vehicule>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}