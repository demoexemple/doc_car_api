// PermisDeConduire.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Conducteur from './Conducteur.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class PermisDeConduire extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare numero: string

  @column()
  declare categorie: string

  @column() // Changed to column.date()
  declare dateDelivrance: Date

  @column() // Changed to column.date()
  declare dateExpiration: Date

  @column()
  declare documentPdf: string

  @belongsTo(() => Conducteur)
  declare conducteur: BelongsTo<typeof Conducteur>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}