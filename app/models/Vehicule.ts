// Vehicule.ts
import { BaseModel, column, hasMany, manyToMany, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import CarteGrise from './CarteGrise.js'
import Assurance from './Assurance.js'
import Vignette from './Vignette.js'
import VisiteTechnique from './VisiteTechnique.js'
import type { HasMany, ManyToMany, BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import CarteBleue from './CarteBleue.js'
import { DateTime } from 'luxon'
import Conducteur from './Conducteur.js'
import User from './user.js'
import { idText } from 'typescript'

export default class Vehicule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare marque: string

  @column()
  declare modele: string

  @column()
  declare type: string

  @column()
  declare usages: string

  // @column()
  // declare immatriculation: string

  // @column()
  // declare annee: number

  // @column()
  // declare couleur: string

  @column({columnName:'proprietaire_id'})
  declare proprietaireId: number

  @belongsTo(() => Conducteur,{
    foreignKey:'proprietaireId',
    localKey:'id'
  })
  declare proprietaire: BelongsTo<typeof Conducteur>

  @manyToMany(() => Conducteur, {
    pivotTable: 'vehicule_conducteurs',
  })
  declare conducteurs: ManyToMany<typeof Conducteur>

  @hasOne(() => CarteGrise)
  declare carteGrise: HasOne<typeof CarteGrise>

  @hasMany(() => Assurance)
  declare assurance: HasMany<typeof Assurance>

  @hasMany(() => Vignette)
  declare vignette: HasMany<typeof Vignette>

  @hasMany(() => CarteBleue)
  declare carteBleue: HasMany<typeof CarteBleue>

  @hasMany(() => VisiteTechnique)
  declare visiteTechnique: HasMany<typeof VisiteTechnique>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}