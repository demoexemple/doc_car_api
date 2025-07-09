import { inject } from '@adonisjs/core'
import VisiteTechnique from '#models/VisiteTechnique'
import Vehicule from '#models/Vehicule'
import { DateTime } from 'luxon'

export interface VisiteTechniqueData {
  centre: string
  dateDernierControle: Date
  dateExpirationControle: Date
  documentPdf?: string
  vehiculeId: number
}

export interface UpdateDernierControleTechniqueData {
  centre?: string
  dateDernierControle?: Date
  dateExpirationControle?: Date
  resultat?: 'Favorable' | 'Défavorable' | 'Avec réserves'
  observations?: string
  documentPdf?: string
}

@inject()
export class VisiteTechniqueService {
  /**
   * Créer une nouvelle visite technique
   */
  async create(visiteData: VisiteTechniqueData,load:boolean=false) {
    // Vérifier si le véhicule existe
    const vehicule = await Vehicule.find(visiteData.vehiculeId)
    if (!vehicule) {
      throw new Error('Le véhicule spécifié n\'existe pas')
    }



    // Vérifier si le véhicule a déjà une visite technique active
    const existingVehiculeVisite = await VisiteTechnique.query()
      .where('vehiculeId', visiteData.vehiculeId)
      .where('date_expiration_controle', '>=', DateTime.now().toJSDate())
      .first()
    
    if (existingVehiculeVisite) {
      throw new Error('Ce véhicule possède déjà une visite technique active')
    }

    // Vérifier les dates
    if (visiteData.dateExpirationControle <= visiteData.dateDernierControle) {
      throw new Error('La date d\'expiration doit être postérieure à la date de visite')
    }



    // Créer la visite technique
    const visite = await VisiteTechnique.create(visiteData)

    // Charger la relation véhicule
    if(load){
          await visite.load('vehicule')
    }
    return visite
  }

  /**
   * Récupérer toutes les visites techniques
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; expired?: boolean; resultat?: string }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const expired = query?.expired
    const resultat = query?.resultat

    let queryBuilder = VisiteTechnique.query()
      .preload('vehicule')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('numero', `%${search}%`)
          .orWhereILike('centre', `%${search}%`)
          .orWhereHas('vehicule', (vehiculeQuery) => {
            vehiculeQuery
              .whereILike('marque', `%${search}%`)
              .orWhereILike('modele', `%${search}%`)
              .orWhereILike('immatriculation', `%${search}%`)
          })
      })
    }

    if (expired !== undefined) {
      const today = DateTime.now().toJSDate()
      if (expired) {
        queryBuilder = queryBuilder.where('date_expiration_controle', '<', today)
      } else {
        queryBuilder = queryBuilder.where('date_expiration_controle', '>=', today)
      }
    }

    if (resultat) {
      queryBuilder = queryBuilder.where('resultat', resultat)
    }

    const visites = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return visites
  }

  /**
   * Récupérer une visite technique par ID
   */
  async getById(id: number) {
    const visite = await VisiteTechnique.findOrFail(id)
    await visite.load('vehicule')
    return visite
  }

  /**
   * Récupérer une visite technique par numéro
   */
  async getByNumero(numero: string) {
    const visite = await VisiteTechnique.findByOrFail('numero', numero)
    await visite.load('vehicule')
    return visite
  }

  /**
   * Récupérer la visite technique active d'un véhicule
   */
  async getActiveByVehiculeId(vehiculeId: number) {
    console.log("dans la visite technique")
    const visite = await VisiteTechnique.query()
      .where('vehicule_id', vehiculeId)
      .firstOrFail()
    // await visite.load('vehicule')

    console.log("visite : ",visite)
    return visite
  }

  /**
   * Récupérer toutes les visites techniques d'un véhicule
   */
  async getAllByVehiculeId(vehiculeId: number) {
    const visites = await VisiteTechnique.query()
      .where('vehiculeId', vehiculeId)
      .preload('vehicule')
      .orderBy('date_dernier_controle', 'desc')

    return visites
  }

  /**
   * Mettre à jour une visite technique
   */
  async update(id: number, updateData: UpdateDernierControleTechniqueData) {
    const visite = await VisiteTechnique.findOrFail(id)



    // Vérifier les dates si elles sont fournies
    if (updateData.dateDernierControle && updateData.dateExpirationControle) {
      if (updateData.dateExpirationControle <= updateData.dateDernierControle) {
        throw new Error('La date d\'expiration doit être postérieure à la date de visite')
      }
    } else if (updateData.dateExpirationControle) {
      if (updateData.dateExpirationControle <= visite.dateDernierControle) {
        throw new Error('La date d\'expiration doit être postérieure à la date de visite')
      }
    } else if (updateData.dateDernierControle) {
      if (visite.dateDernierControle <= updateData.dateDernierControle) {
        throw new Error('La date d\'expiration doit être postérieure à la date de visite')
      }
    }

    // Vérifier le résultat si fourni
    if (updateData.resultat) {
      const resultatsValides = ['Favorable', 'Défavorable', 'Avec réserves']
      if (!resultatsValides.includes(updateData.resultat)) {
        throw new Error('Le résultat doit être Favorable, Défavorable ou Avec réserves')
      }
    }

    // Mettre à jour les champs
    visite.merge(updateData)
    await visite.save()

    // Charger la relation véhicule
    await visite.load('vehicule')

    return visite
  }

  /**
   * Supprimer une visite technique
   */
  async delete(id: number) {
    const visite = await VisiteTechnique.findOrFail(id)
    await visite.delete()
  }

  /**
   * Vérifier si une visite technique est expirée
   */
  async isExpired(id: number): Promise<boolean> {
    const visite = await VisiteTechnique.findOrFail(id)
    const today = DateTime.now().toJSDate()
    return visite.dateExpirationControle < today
  }

  /**
   * Récupérer les visites techniques expirées
   */
  async getExpired() {
    const today = DateTime.now().toJSDate()
    
    const visitesExpirees = await VisiteTechnique.query()
      .where('date_expiration_controle', '<', today)
      .preload('vehicule')
      .orderBy('date_expiration_controle', 'asc')

    return visitesExpirees
  }

  /**
   * Récupérer les visites techniques qui expirent bientôt (dans les 30 jours)
   */
  async getExpiringSoon() {
    const today = DateTime.now().toJSDate()
    const thirtyDaysFromNow = DateTime.now().plus({ days: 30 }).toJSDate()
    
    const visitesExpirant = await VisiteTechnique.query()
      .where('date_expiration_controle', '>=', today)
      .where('date_expiration_controle', '<=', thirtyDaysFromNow)
      .preload('vehicule')
      .orderBy('date_expiration_controle', 'asc')

    return visitesExpirant
  }

  /**
   * Récupérer les visites techniques défavorables
   */
  async getDefavorables() {
    const visitesDefavorables = await VisiteTechnique.query()
      .where('resultat', 'Défavorable')
      .preload('vehicule')
      .orderBy('date_dernier_controle', 'desc')

    return visitesDefavorables
  }

  /**
   * Rechercher des visites techniques
   */
  async search(searchTerm: string) {
    const visites = await VisiteTechnique.query()
      .where((builder) => {
        builder
          .whereILike('numero', `%${searchTerm}%`)
          .orWhereILike('centre', `%${searchTerm}%`)
          .orWhereHas('vehicule', (vehiculeQuery) => {
            vehiculeQuery
              .whereILike('marque', `%${searchTerm}%`)
              .orWhereILike('modele', `%${searchTerm}%`)
              .orWhereILike('immatriculation', `%${searchTerm}%`)
          })
      })
      .preload('vehicule')
      .orderBy('createdAt', 'desc')

    return visites
  }

  /**
   * Statistiques des visites techniques
   */
  async getStats() {
    const totalVisites = await VisiteTechnique.query().count('* as total')
    const visitesExpirees = await this.getExpired()
    const visitesExpirant = await this.getExpiringSoon()
    
    const today = DateTime.now().toJSDate()
    const visitesValides = await VisiteTechnique.query()
      .where('date_expiration_controle', '>=', today)
      .count('* as valides')

    // Statistiques par résultat
    const favorables = await VisiteTechnique.query()
      .where('resultat', 'Favorable')
      .count('* as favorables')

    const defavorables = await VisiteTechnique.query()
      .where('resultat', 'Défavorable')
      .count('* as defavorables')

    const avecReserves = await VisiteTechnique.query()
      .where('resultat', 'Avec réserves')
      .count('* as avec_reserves')

    return {
      total: totalVisites[0].$extras.total,
      valides: visitesValides[0].$extras.valides,
      expires: visitesExpirees.length,
      expirant: visitesExpirant.length,
      favorables: favorables[0].$extras.favorables,
      defavorables: defavorables[0].$extras.defavorables,
      avecReserves: avecReserves[0].$extras.avec_reserves
    }
  }
} 