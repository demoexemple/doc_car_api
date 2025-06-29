// Conducteur.ts
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import PermisDeConduire from './PermisDeConduire.js'
import Vehicule from './Vehicule.js' // Import Vehicule
import { DateTime } from 'luxon'

export default class Conducteur extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare prenom: string

  @column()
  declare nom: string

  @column()
  declare adresse: string

  @column()
  declare telephone: string

  @column()
  declare numCNI: string

  @column()
  declare frontCni: string

  @column()
  declare backCni: string

  @column()
  declare profilImage: string

  @hasMany(() => PermisDeConduire)
  declare permisDeConduire: HasMany<typeof PermisDeConduire>

  // Corrected Many-to-Many relationship with Vehicule
  @manyToMany(() => Vehicule, {
    pivotTable: 'vehicule_conducteurs',
  })
  declare vehicules: ManyToMany<typeof Vehicule> // Renamed from vehiculesAccess for clarity

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}