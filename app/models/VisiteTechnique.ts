// VisiteTechnique.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Vehicule from './Vehicule.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class VisiteTechnique extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column() // Changed to column.date()
  declare dateDernierControle: Date

  @column() // Changed to column.date()
  declare dateExpirationControle: Date

  @column()
  declare centre: string

  @column()
  declare documentPdf: string

  @belongsTo(() => Vehicule)
  declare vehicule: BelongsTo<typeof Vehicule>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}