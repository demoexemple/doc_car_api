import { inject } from '@adonisjs/core'
import Assurance from '#models/Assurance'
import Vehicule from '#models/Vehicule'
import { DateTime } from 'luxon'

export interface AssuranceData {
  numeroContrat: string
  companie: string
  dateDebut: Date
  dateExpiration: Date
  documentPdf?: string
  vehiculeId: number
}

export interface UpdateAssuranceData {
  numeroContrat?: string
  companie?: string
  dateDebut?: Date
  dateExpiration?: Date
  documentPdf?: string
}

@inject()
export class AssuranceService {
  /**
   * Créer une nouvelle assurance
   */
  async create(assuranceData: AssuranceData,load:boolean=false) {
    // Vérifier si le véhicule existe
    const vehicule = await Vehicule.find(assuranceData.vehiculeId)
    if (!vehicule) {
      throw new Error('Le véhicule spécifié n\'existe pas')
    }

    // Vérifier si le numéro d'assurance existe déjà
    const existingAssurance = await Assurance.findBy('numero_contrat', assuranceData.numeroContrat)
    if (existingAssurance) {
      throw new Error('Une assurance avec ce numéro existe déjà')
    }

    // Vérifier si le véhicule a déjà une assurance active
    const existingVehiculeAssurance = await Assurance.query()
      .where('vehiculeId', assuranceData.vehiculeId)
      .where('date_expiration', '>=', DateTime.now().toJSDate())
      .first()
    
    if (existingVehiculeAssurance) {
      throw new Error('Ce véhicule possède déjà une assurance active')
    }

    // Vérifier les dates
    if (assuranceData.dateExpiration <= assuranceData.dateDebut) {
      throw new Error('La date de fin doit être postérieure à la date de début')
    }


    // Créer l'assurance
    const assurance = await Assurance.create(assuranceData)

    // Charger la relation véhicule
    if(load){
          await assurance.load('vehicule')
    }

    return assurance
  }

  /**
   * Récupérer toutes les assurances
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; expired?: boolean }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const expired = query?.expired

    let queryBuilder = Assurance.query()
      .preload('vehicule')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('numero', `%${search}%`)
          .orWhereILike('companie', `%${search}%`)
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
        queryBuilder = queryBuilder.where('date_expiration', '<', today)
      } else {
        queryBuilder = queryBuilder.where('date_expiration', '>=', today)
      }
    }

    const assurances = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return assurances
  }

  /**
   * Récupérer une assurance par ID
   */
  async getById(id: number) {
    const assurance = await Assurance.findOrFail(id)
    await assurance.load('vehicule')
    return assurance
  }

  /**
   * Récupérer une assurance par numéro
   */
  async getByNumero(numero: string) {
    const assurance = await Assurance.findByOrFail('numero', numero)
    await assurance.load('vehicule')
    return assurance
  }

  /**
   * Récupérer l'assurance active d'un véhicule
   */
  async getActiveByVehiculeId(vehiculeId: number) {
    const today = DateTime.now().toJSDate()
    const assurance = await Assurance.query()
      .where('vehiculeId', vehiculeId)
      .where('date_expiration', '>=', today)
      .orderBy('date_expiration', 'desc')
      .firstOrFail()
    
    await assurance.load('vehicule')
    return assurance
  }

  /**
   * Récupérer toutes les assurances d'un véhicule
   */
  async getAllByVehiculeId(vehiculeId: number) {
    const assurances = await Assurance.query()
      .where('vehiculeId', vehiculeId)
      .preload('vehicule')
      .orderBy('dateDebut', 'desc')

    return assurances
  }

  /**
   * Mettre à jour une assurance
   */
  async update(id: number, updateData: UpdateAssuranceData) {
    const assurance = await Assurance.findOrFail(id)

    // Vérifier si le numéro est déjà utilisé par une autre assurance
    if (updateData.numeroContrat && updateData.numeroContrat !== assurance.numeroContrat) {
      const existingAssurance = await Assurance.query()
        .where('numero_contrat', updateData.numeroContrat)
        .whereNot('id', id)
        .first()
      
      if (existingAssurance) {
        throw new Error('Ce numéro d\'assurance est déjà utilisé')
      }
    }

    // Vérifier les dates si elles sont fournies
    if (updateData.dateDebut && updateData.dateExpiration) {
      if (updateData.dateExpiration <= updateData.dateDebut) {
        throw new Error('La date de fin doit être postérieure à la date de début')
      }
    } else if (updateData.dateExpiration) {
      if (updateData.dateExpiration <= assurance.dateDebut) {
        throw new Error('La date de fin doit être postérieure à la date de début')
      }
    } else if (updateData.dateDebut) {
      if (assurance.dateExpiration <= updateData.dateDebut) {
        throw new Error('La date de fin doit être postérieure à la date de début')
      }
    }



    // Mettre à jour les champs
    assurance.merge(updateData)
    await assurance.save()

    // Charger la relation véhicule
    await assurance.load('vehicule')

    return assurance
  }

  /**
   * Supprimer une assurance
   */
  async delete(id: number) {
    const assurance = await Assurance.findOrFail(id)
    await assurance.delete()
  }

  /**
   * Vérifier si une assurance est expirée
   */
  async isExpired(id: number): Promise<boolean> {
    const assurance = await Assurance.findOrFail(id)
    const today = DateTime.now().toJSDate()
    return assurance.dateExpiration < today
  }

  /**
   * Récupérer les assurances expirées
   */
  async getExpired() {
    const today = DateTime.now().toJSDate()
    
    const assurancesExpirees = await Assurance.query()
      .where('date_expiration', '<', today)
      .preload('vehicule')
      .orderBy('date_expiration', 'asc')

    return assurancesExpirees
  }

  /**
   * Récupérer les assurances qui expirent bientôt (dans les 30 jours)
   */
  async getExpiringSoon() {
    const today = DateTime.now().toJSDate()
    const thirtyDaysFromNow = DateTime.now().plus({ days: 30 }).toJSDate()
    
    const assurancesExpirant = await Assurance.query()
      .where('date_expiration', '>=', today)
      .where('date_expiration', '<=', thirtyDaysFromNow)
      .preload('vehicule')
      .orderBy('date_expiration', 'asc')

    return assurancesExpirant
  }

  /**
   * Rechercher des assurances
   */
  async search(searchTerm: string) {
    const assurances = await Assurance.query()
      .where((builder) => {
        builder
          .whereILike('numero', `%${searchTerm}%`)
          .orWhereILike('companie', `%${searchTerm}%`)
          .orWhereHas('vehicule', (vehiculeQuery) => {
            vehiculeQuery
              .whereILike('marque', `%${searchTerm}%`)
              .orWhereILike('modele', `%${searchTerm}%`)
              .orWhereILike('immatriculation', `%${searchTerm}%`)
          })
      })
      .preload('vehicule')
      .orderBy('createdAt', 'desc')

    return assurances
  }

  /**
   * Statistiques des assurances
   */
  async getStats() {
    const totalAssurances = await Assurance.query().count('* as total')
    const assurancesExpirees = await this.getExpired()
    const assurancesExpirant = await this.getExpiringSoon()
    
    const today = DateTime.now().toJSDate()
    const assurancesValides = await Assurance.query()
      .where('date_expiration', '>=', today)
      .count('* as valides')

   

    return {
      total: totalAssurances[0].$extras.total,
      valides: assurancesValides[0].$extras.valides,
      expires: assurancesExpirees.length,
      expirant: assurancesExpirant.length,
    }
  }
} 