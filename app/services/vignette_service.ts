import { inject } from '@adonisjs/core'
import Vignette from '#models/Vignette'
import Vehicule from '#models/Vehicule'
import { DateTime } from 'luxon'

export interface VignetteData {
  dateDelivrance: Date
  dateExpiration: Date
  montant: number
  documentPdf?: string
  vehiculeId: number
}

export interface UpdateVignetteData {
  dateDelivrance?: Date
  dateExpiration?: Date
  montant?: number
  documentPdf?: string
}

@inject()
export class VignetteService {
  /**
   * Créer une nouvelle vignette
   */
  async create(vignetteData: VignetteData,load :boolean=false) {
    // Vérifier si le véhicule existe
    const vehicule = await Vehicule.find(vignetteData.vehiculeId)
    if (!vehicule) {
      throw new Error('Le véhicule spécifié n\'existe pas')
    }

    // Vérifier si le numéro de vignette existe déjà
   

    // Vérifier si le véhicule a déjà une vignette active
    const existingVehiculeVignette = await Vignette.query()
      .where('vehiculeId', vignetteData.vehiculeId)
      .where('dateExpiration', '>=', DateTime.now().toJSDate())
      .first()
    
    if (existingVehiculeVignette) {
      throw new Error('Ce véhicule possède déjà une vignette active')
    }

    // Vérifier les dates
    if (vignetteData.dateExpiration <= vignetteData.dateDelivrance) {
      throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
    }

    // Vérifier le montant
    if (vignetteData.montant <= 0) {
      throw new Error('Le montant doit être positif')
    }

    // Créer la vignette
    const vignette = await Vignette.create(vignetteData)

    // Charger la relation véhicule
    if(load){
    await vignette.load('vehicule')
    }

    return vignette
  }

  /**
   * Récupérer toutes les vignettes
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; expired?: boolean }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const expired = query?.expired

    let queryBuilder = Vignette.query()
      .preload('vehicule')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('montant', `%${search}%`)
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
        queryBuilder = queryBuilder.where('dateExpiration', '<', today)
      } else {
        queryBuilder = queryBuilder.where('dateExpiration', '>=', today)
      }
    }

    const vignettes = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return vignettes
  }

  /**
   * Récupérer une vignette par ID
   */
  async getById(id: number) {
    const vignette = await Vignette.findOrFail(id)
    await vignette.load('vehicule')
    return vignette
  }

  /**
   * Récupérer une vignette par numéro
   */


  /**
   * Récupérer la vignette active d'un véhicule
   */
  async getActiveByVehiculeId(vehiculeId: number) {
    const today = DateTime.now().toJSDate()
    const vignette = await Vignette.query()
      .where('vehiculeId', vehiculeId)
      .where('dateExpiration', '>=', today)
      .orderBy('dateExpiration', 'desc')
      .firstOrFail()
    
    await vignette.load('vehicule')
    return vignette
  }

  /**
   * Récupérer toutes les vignettes d'un véhicule
   */
  async getAllByVehiculeId(vehiculeId: number) {
    const vignettes = await Vignette.query()
      .where('vehiculeId', vehiculeId)
      .preload('vehicule')
      .orderBy('dateDelivrance', 'desc')

    return vignettes
  }

  /**
   * Mettre à jour une vignette
   */
  async update(id: number, updateData: UpdateVignetteData) {
    const vignette = await Vignette.findOrFail(id)

    // Vérifier les dates si elles sont fournies
    if (updateData.dateDelivrance && updateData.dateExpiration) {
      if (updateData.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateExpiration) {
      if (updateData.dateExpiration <= vignette.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateDelivrance) {
      if (vignette.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    }

    // Vérifier le montant si fourni
    if (updateData.montant !== undefined && updateData.montant <= 0) {
      throw new Error('Le montant doit être positif')
    }

    // Mettre à jour les champs
    vignette.merge(updateData)
    await vignette.save()

    // Charger la relation véhicule
    await vignette.load('vehicule')

    return vignette
  }

  /**
   * Supprimer une vignette
   */
  async delete(id: number) {
    const vignette = await Vignette.findOrFail(id)
    await vignette.delete()
  }

  /**
   * Vérifier si une vignette est expirée
   */
  async isExpired(id: number): Promise<boolean> {
    const vignette = await Vignette.findOrFail(id)
    const today = DateTime.now().toJSDate()
    return vignette.dateExpiration < today
  }

  /**
   * Récupérer les vignettes expirées
   */
  async getExpired() {
    const today = DateTime.now().toJSDate()
    
    const vignettesExpirees = await Vignette.query()
      .where('dateExpiration', '<', today)
      .preload('vehicule')
      .orderBy('dateExpiration', 'asc')

    return vignettesExpirees
  }

  /**
   * Récupérer les vignettes qui expirent bientôt (dans les 30 jours)
   */
  async getExpiringSoon() {
    const today = DateTime.now().toJSDate()
    const thirtyDaysFromNow = DateTime.now().plus({ days: 30 }).toJSDate()
    
    const vignettesExpirant = await Vignette.query()
      .where('dateExpiration', '>=', today)
      .where('dateExpiration', '<=', thirtyDaysFromNow)
      .preload('vehicule')
      .orderBy('dateExpiration', 'asc')

    return vignettesExpirant
  }

  /**
   * Rechercher des vignettes
   */
  async search(searchTerm: string) {
    const vignettes = await Vignette.query()
      .where((builder) => {
        builder
          .whereILike('numero', `%${searchTerm}%`)
          .orWhereHas('vehicule', (vehiculeQuery) => {
            vehiculeQuery
              .whereILike('marque', `%${searchTerm}%`)
              .orWhereILike('modele', `%${searchTerm}%`)
              .orWhereILike('immatriculation', `%${searchTerm}%`)
          })
      })
      .preload('vehicule')
      .orderBy('createdAt', 'desc')

    return vignettes
  }

  /**
   * Statistiques des vignettes
   */
  async getStats() {
    const totalVignettes = await Vignette.query().count('* as total')
    const vignettesExpirees = await this.getExpired()
    const vignettesExpirant = await this.getExpiringSoon()
    
    const today = DateTime.now().toJSDate()
    const vignettesValides = await Vignette.query()
      .where('dateExpiration', '>=', today)
      .count('* as valides')

    // Calculer le montant total des vignettes actives
    const montantTotal = await Vignette.query()
      .where('dateExpiration', '>=', today)
      .sum('montant as total_montant')

    return {
      total: totalVignettes[0].$extras.total,
      valides: vignettesValides[0].$extras.valides,
      expires: vignettesExpirees.length,
      expirant: vignettesExpirant.length,
      montantTotal: montantTotal[0].$extras.total_montant || 0
    }
  }
} 