import { inject } from '@adonisjs/core'
import CarteGrise from '#models/CarteGrise'
import Vehicule from '#models/Vehicule'
import { DateTime } from 'luxon'

export interface CarteGriseData {
  numero: string
  dateDelivrance: Date
  dateExpiration: Date
  documentPdf?: string
  vehiculeId: number
}

export interface UpdateCarteGriseData {
  numero?: string
  dateDelivrance?: Date
  dateExpiration?: Date
  documentPdf?: string
}

@inject()
export class CarteGriseService {
  /**
   * Créer une nouvelle carte grise
   */
  async create(carteGriseData: CarteGriseData,load:boolean=false) {
    // Vérifier si le véhicule existe
    const vehicule = await Vehicule.find(carteGriseData.vehiculeId)
    if (!vehicule) {
      throw new Error('Le véhicule spécifié n\'existe pas')
    }

    // Vérifier si le numéro de carte grise existe déjà
    const existingCarteGrise = await CarteGrise.findBy('numero', carteGriseData.numero)
    if (existingCarteGrise) {
      throw new Error('Une carte grise avec ce numéro existe déjà')
    }

    // Vérifier si le véhicule a déjà une carte grise
    const existingVehiculeCarteGrise = await CarteGrise.findBy('vehiculeId', carteGriseData.vehiculeId)
    if (existingVehiculeCarteGrise) {
      throw new Error('Ce véhicule possède déjà une carte grise')
    }

    // Vérifier les dates
    if (carteGriseData.dateExpiration <= carteGriseData.dateDelivrance) {
      throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
    }

    // Créer la carte grise
    const carteGrise = await CarteGrise.create(carteGriseData)

    // Charger la relation véhicule
    if(load){
      await carteGrise.load('vehicule')
    }
    return carteGrise
  }

  /**
   * Récupérer toutes les cartes grises
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; expired?: boolean }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const expired = query?.expired

    let queryBuilder = CarteGrise.query()
      .preload('vehicule')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('numero', `%${search}%`)
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

    const cartesGrises = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return cartesGrises
  }

  /**
   * Récupérer une carte grise par ID
   */
  async getById(id: number) {
    const carteGrise = await CarteGrise.findOrFail(id)
    await carteGrise.load('vehicule')
    return carteGrise
  }

  /**
   * Récupérer une carte grise par numéro
   */
  async getByNumero(numero: string) {
    const carteGrise = await CarteGrise.findByOrFail('numero', numero)
    await carteGrise.load('vehicule')
    return carteGrise
  }

  /**
   * Récupérer la carte grise d'un véhicule
   */
  async getByVehiculeId(vehiculeId: number) {
    const carteGrise = await CarteGrise.findByOrFail('vehiculeId', vehiculeId)
    // await carteGrise.load('vehicule')
    return carteGrise
  }

  /**
   * Récupérer toutes les cartes grises d'un véhicule
   */
  async getAllByVehiculeId(vehiculeId: number) {
    const cartesGrises = await CarteGrise.query()
      .where('vehiculeId', vehiculeId)
      .preload('vehicule')
      .orderBy('dateDelivrance', 'desc')

    return cartesGrises
  }

  /**
   * Mettre à jour une carte grise
   */
  async update(id: number, updateData: UpdateCarteGriseData) {
    const carteGrise = await CarteGrise.findOrFail(id)

    // Vérifier si le numéro est déjà utilisé par une autre carte grise
    if (updateData.numero && updateData.numero !== carteGrise.numero) {
      const existingCarteGrise = await CarteGrise.query()
        .where('numero', updateData.numero)
        .whereNot('id', id)
        .first()
      
      if (existingCarteGrise) {
        throw new Error('Ce numéro de carte grise est déjà utilisé')
      }
    }

    // Vérifier les dates si elles sont fournies
    if (updateData.dateDelivrance && updateData.dateExpiration) {
      if (updateData.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateExpiration) {
      if (updateData.dateExpiration <= carteGrise.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateDelivrance) {
      if (carteGrise.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    }

    // Mettre à jour les champs
    carteGrise.merge(updateData)
    await carteGrise.save()

    // Charger la relation véhicule
    await carteGrise.load('vehicule')

    return carteGrise
  }

  /**
   * Supprimer une carte grise
   */
  async delete(id: number) {
    const carteGrise = await CarteGrise.findOrFail(id)
    await carteGrise.delete()
  }

  /**
   * Vérifier si une carte grise est expirée
   */
  async isExpired(id: number): Promise<boolean> {
    const carteGrise = await CarteGrise.findOrFail(id)
    const today = DateTime.now().toJSDate()
    return carteGrise.dateExpiration < today
  }

  /**
   * Récupérer les cartes grises expirées
   */
  async getExpired() {
    const today = DateTime.now().toJSDate()
    
    const cartesGrisesExpirees = await CarteGrise.query()
      .where('dateExpiration', '<', today)
      .preload('vehicule')
      .orderBy('dateExpiration', 'asc')

    return cartesGrisesExpirees
  }

  /**
   * Récupérer les cartes grises qui expirent bientôt (dans les 30 jours)
   */
  async getExpiringSoon() {
    const today = DateTime.now().toJSDate()
    const thirtyDaysFromNow = DateTime.now().plus({ days: 30 }).toJSDate()
    
    const cartesGrisesExpirant = await CarteGrise.query()
      .where('dateExpiration', '>=', today)
      .where('dateExpiration', '<=', thirtyDaysFromNow)
      .preload('vehicule')
      .orderBy('dateExpiration', 'asc')

    return cartesGrisesExpirant
  }

  /**
   * Rechercher des cartes grises
   */
  async search(searchTerm: string) {
    const cartesGrises = await CarteGrise.query()
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

    return cartesGrises
  }

  /**
   * Statistiques des cartes grises
   */
  async getStats() {
    const totalCartesGrises = await CarteGrise.query().count('* as total')
    const cartesGrisesExpirees = await this.getExpired()
    const cartesGrisesExpirant = await this.getExpiringSoon()
    
    const today = DateTime.now().toJSDate()
    const cartesGrisesValides = await CarteGrise.query()
      .where('dateExpiration', '>=', today)
      .count('* as valides')

    return {
      total: totalCartesGrises[0].$extras.total,
      valides: cartesGrisesValides[0].$extras.valides,
      expires: cartesGrisesExpirees.length,
      expirant: cartesGrisesExpirant.length
    }
  }
} 