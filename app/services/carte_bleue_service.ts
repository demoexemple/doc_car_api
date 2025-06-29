import { inject } from '@adonisjs/core'
import CarteBleue from '#models/CarteBleue'
import Vehicule from '#models/Vehicule'
import { DateTime } from 'luxon'

export interface CarteBleueData {
  numero: string
  type: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride'
  dateDelivrance: Date
  dateExpiration: Date
  montant: number
  documentPdf?: string
  vehiculeId: number
}

export interface UpdateCarteBleueData {
  numero?: string
  type?: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride'
  dateDelivrance?: Date
  dateExpiration?: Date
  montant?: number
  documentPdf?: string
}

@inject()
export class CarteBleueService {
  /**
   * Créer une nouvelle carte bleue
   */
  async create(carteBleueData: CarteBleueData,load:boolean=false) {
    // Vérifier si le véhicule existe
    const vehicule = await Vehicule.find(carteBleueData.vehiculeId)
    if (!vehicule) {
      throw new Error('Le véhicule spécifié n\'existe pas')
    }

    // Vérifier si le numéro de carte bleue existe déjà
    const existingCarteBleue = await CarteBleue.findBy('numero', carteBleueData.numero)
    if (existingCarteBleue) {
      throw new Error('Une carte bleue avec ce numéro existe déjà')
    }

    // Vérifier si le véhicule a déjà une carte bleue active
    const existingVehiculeCarteBleue = await CarteBleue.query()
      .where('vehiculeId', carteBleueData.vehiculeId)
      .where('dateExpiration', '>=', DateTime.now().toJSDate())
      .first()
    
    if (existingVehiculeCarteBleue) {
      throw new Error('Ce véhicule possède déjà une carte bleue active')
    }

    // Vérifier les dates
    if (carteBleueData.dateExpiration <= carteBleueData.dateDelivrance) {
      throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
    }

    // Vérifier le montant
    if (carteBleueData.montant <= 0) {
      throw new Error('Le montant doit être positif')
    }

    // Vérifier le type
    const typesValides = ['Essence', 'Diesel', 'Électrique', 'Hybride']
    if (!typesValides.includes(carteBleueData.type)) {
      throw new Error('Le type doit être Essence, Diesel, Électrique ou Hybride')
    }

    // Créer la carte bleue
    const carteBleue = await CarteBleue.create(carteBleueData)

    // Charger la relation véhicule
    if(load){
      await carteBleue.load('vehicule')
    }

    return carteBleue
  }

  /**
   * Récupérer toutes les cartes bleues
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; expired?: boolean; type?: string }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const expired = query?.expired
    const type = query?.type

    let queryBuilder = CarteBleue.query()
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

    if (type) {
      queryBuilder = queryBuilder.where('type', type)
    }

    const cartesBleues = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return cartesBleues
  }

  /**
   * Récupérer une carte bleue par ID
   */
  async getById(id: number) {
    const carteBleue = await CarteBleue.findOrFail(id)
    await carteBleue.load('vehicule')
    return carteBleue
  }

  /**
   * Récupérer une carte bleue par numéro
   */
  async getByNumero(numero: string) {
    const carteBleue = await CarteBleue.findByOrFail('numero', numero)
    await carteBleue.load('vehicule')
    return carteBleue
  }

  /**
   * Récupérer la carte bleue active d'un véhicule
   */
  async getActiveByVehiculeId(vehiculeId: number) {
    const today = DateTime.now().toJSDate()
    const carteBleue = await CarteBleue.query()
      .where('vehiculeId', vehiculeId)
      .where('dateExpiration', '>=', today)
      .orderBy('dateExpiration', 'desc')
      .firstOrFail()
    
    await carteBleue.load('vehicule')
    return carteBleue
  }

  /**
   * Récupérer toutes les cartes bleues d'un véhicule
   */
  async getAllByVehiculeId(vehiculeId: number) {
    const cartesBleues = await CarteBleue.query()
      .where('vehiculeId', vehiculeId)
      .preload('vehicule')
      .orderBy('dateDelivrance', 'desc')

    return cartesBleues
  }

  /**
   * Mettre à jour une carte bleue
   */
  async update(id: number, updateData: UpdateCarteBleueData) {
    const carteBleue = await CarteBleue.findOrFail(id)

    // Vérifier si le numéro est déjà utilisé par une autre carte bleue
    if (updateData.numero && updateData.numero !== carteBleue.numero) {
      const existingCarteBleue = await CarteBleue.query()
        .where('numero', updateData.numero)
        .whereNot('id', id)
        .first()
      
      if (existingCarteBleue) {
        throw new Error('Ce numéro de carte bleue est déjà utilisé')
      }
    }

    // Vérifier les dates si elles sont fournies
    if (updateData.dateDelivrance && updateData.dateExpiration) {
      if (updateData.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateExpiration) {
      if (updateData.dateExpiration <= carteBleue.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateDelivrance) {
      if (carteBleue.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    }

    // Vérifier le montant si fourni
    if (updateData.montant !== undefined && updateData.montant <= 0) {
      throw new Error('Le montant doit être positif')
    }

    // Vérifier le type si fourni
    if (updateData.type) {
      const typesValides = ['Essence', 'Diesel', 'Électrique', 'Hybride']
      if (!typesValides.includes(updateData.type)) {
        throw new Error('Le type doit être Essence, Diesel, Électrique ou Hybride')
      }
    }

    // Mettre à jour les champs
    carteBleue.merge(updateData)
    await carteBleue.save()

    // Charger la relation véhicule
    await carteBleue.load('vehicule')

    return carteBleue
  }

  /**
   * Supprimer une carte bleue
   */
  async delete(id: number) {
    const carteBleue = await CarteBleue.findOrFail(id)
    await carteBleue.delete()
  }

  /**
   * Vérifier si une carte bleue est expirée
   */
  async isExpired(id: number): Promise<boolean> {
    const carteBleue = await CarteBleue.findOrFail(id)
    const today = DateTime.now().toJSDate()
    return carteBleue.dateExpiration < today
  }

  /**
   * Récupérer les cartes bleues expirées
   */
  async getExpired() {
    const today = DateTime.now().toJSDate()
    
    const cartesBleuesExpirees = await CarteBleue.query()
      .where('dateExpiration', '<', today)
      .preload('vehicule')
      .orderBy('dateExpiration', 'asc')

    return cartesBleuesExpirees
  }

  /**
   * Récupérer les cartes bleues qui expirent bientôt (dans les 30 jours)
   */
  async getExpiringSoon() {
    const today = DateTime.now().toJSDate()
    const thirtyDaysFromNow = DateTime.now().plus({ days: 30 }).toJSDate()
    
    const cartesBleuesExpirant = await CarteBleue.query()
      .where('dateExpiration', '>=', today)
      .where('dateExpiration', '<=', thirtyDaysFromNow)
      .preload('vehicule')
      .orderBy('dateExpiration', 'asc')

    return cartesBleuesExpirant
  }

  /**
   * Récupérer les cartes bleues par type
   */
  async getByType(type: string) {
    const cartesBleues = await CarteBleue.query()
      .where('type', type)
      .preload('vehicule')
      .orderBy('createdAt', 'desc')

    return cartesBleues
  }

  /**
   * Rechercher des cartes bleues
   */
  async search(searchTerm: string) {
    const cartesBleues = await CarteBleue.query()
      .where((builder) => {
        builder
          .whereILike('numero', `%${searchTerm}%`)
          .orWhereILike('type', `%${searchTerm}%`)
          .orWhereHas('vehicule', (vehiculeQuery) => {
            vehiculeQuery
              .whereILike('marque', `%${searchTerm}%`)
              .orWhereILike('modele', `%${searchTerm}%`)
              .orWhereILike('immatriculation', `%${searchTerm}%`)
          })
      })
      .preload('vehicule')
      .orderBy('createdAt', 'desc')

    return cartesBleues
  }

  /**
   * Statistiques des cartes bleues
   */
  async getStats() {
    const totalCartesBleues = await CarteBleue.query().count('* as total')
    const cartesBleuesExpirees = await this.getExpired()
    const cartesBleuesExpirant = await this.getExpiringSoon()
    
    const today = DateTime.now().toJSDate()
    const cartesBleuesValides = await CarteBleue.query()
      .where('dateExpiration', '>=', today)
      .count('* as valides')

    // Calculer le montant total des cartes bleues actives
    const montantTotal = await CarteBleue.query()
      .where('dateExpiration', '>=', today)
      .sum('montant as total_montant')

    // Statistiques par type
    const essence = await CarteBleue.query()
      .where('type', 'Essence')
      .count('* as essence')

    const diesel = await CarteBleue.query()
      .where('type', 'Diesel')
      .count('* as diesel')

    const electrique = await CarteBleue.query()
      .where('type', 'Électrique')
      .count('* as electrique')

    const hybride = await CarteBleue.query()
      .where('type', 'Hybride')
      .count('* as hybride')

    return {
      total: totalCartesBleues[0].$extras.total,
      valides: cartesBleuesValides[0].$extras.valides,
      expires: cartesBleuesExpirees.length,
      expirant: cartesBleuesExpirant.length,
      montantTotal: montantTotal[0].$extras.total_montant || 0,
      parType: {
        essence: essence[0].$extras.essence,
        diesel: diesel[0].$extras.diesel,
        electrique: electrique[0].$extras.electrique,
        hybride: hybride[0].$extras.hybride
      }
    }
  }
} 