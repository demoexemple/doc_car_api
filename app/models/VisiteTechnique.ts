// VisiteTechnique.ts
import { BaseModel, column, belongsTo, computed } from '@adonisjs/lucid/orm'
import Vehicule from './Vehicule.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class VisiteTechnique extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare centre: string

  @column()
  declare dateDernierControle: Date

  @column()
  declare dateExpirationControle: Date


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
      return this.dateExpirationControle > new Date()
   } 
}