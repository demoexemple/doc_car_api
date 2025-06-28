// Vehicule.ts
import { BaseModel, column, hasOne, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import CarteGrise from './CarteGrise.js'
import Assurance from './Assurance.js'
import Vignette from './Vignette.js'
import VisiteTechnique from './VisiteTechnique.js'
import type { HasOne, ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import CarteBleue from './CarteBleue.js'
import { DateTime } from 'luxon'
import Conducteur from './Conducteur.js'
import User from './user.js'

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

  @belongsTo(() => User)
  declare proprietaire: BelongsTo<typeof User>

  @manyToMany(() => Conducteur, { // Renamed from conducteursAccess for clarity
    pivotTable: 'vehicule_conducteurs',
  })
  declare conducteurs: ManyToMany<typeof Conducteur>


  @hasOne(() => CarteGrise)
  declare carteGrise: HasOne<typeof CarteGrise>

  @hasOne(() => Assurance)
  declare assurance: HasOne<typeof Assurance>

  @hasOne(() => Vignette)
  declare vignette: HasOne<typeof Vignette>

  @hasOne(() => CarteBleue)
  declare carteBleu: HasOne<typeof CarteBleue>

  @hasOne(() => VisiteTechnique)
  declare visiteTechnique: HasOne<typeof VisiteTechnique>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}