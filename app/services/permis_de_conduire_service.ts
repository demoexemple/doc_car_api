import { inject } from '@adonisjs/core'
import PermisDeConduire from '#models/PermisDeConduire'
import Conducteur from '#models/Conducteur'
import { DateTime } from 'luxon'

export interface PermisDeConduireData {
  numero: string
  categorie: string
  dateDelivrance: Date
  dateExpiration: Date
  documentPdf?: string
  conducteurId: number
}

export interface UpdatePermisDeConduireData {
  numero?: string
  categorie?: string
  dateDelivrance?: Date
  dateExpiration?: Date
  documentPdf?: string
}

@inject()
export class PermisDeConduireService {
  /**
   * Créer un nouveau permis de conduire
   */
  async create(permisData: PermisDeConduireData) {
    // Vérifier si le conducteur existe
    const conducteur = await Conducteur.find(permisData.conducteurId)
    if (!conducteur) {
      throw new Error('Le conducteur spécifié n\'existe pas')
    }

    // Vérifier si le numéro de permis existe déjà
    const existingPermis = await PermisDeConduire.findBy('numero', permisData.numero)
    if (existingPermis) {
      throw new Error('Un permis de conduire avec ce numéro existe déjà')
    }

    // Vérifier si le conducteur a déjà un permis
    const existingConducteurPermis = await PermisDeConduire.findBy('conducteurId', permisData.conducteurId)
    if (existingConducteurPermis) {
      throw new Error('Ce conducteur possède déjà un permis de conduire')
    }

    // Vérifier les dates
    if (permisData.dateExpiration <= permisData.dateDelivrance) {
      throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
    }

    // Créer le permis
    const permis = await PermisDeConduire.create(permisData)

    // Charger la relation conducteur
    await permis.load('conducteur')

    return permis
  }

  /**
   * Récupérer tous les permis de conduire
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; expired?: boolean }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const expired = query?.expired

    let queryBuilder = PermisDeConduire.query()
      .preload('conducteur')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('numero', `%${search}%`)
          .orWhereILike('categorie', `%${search}%`)
          .orWhereHas('conducteur', (conducteurQuery) => {
            conducteurQuery
              .whereILike('prenom', `%${search}%`)
              .orWhereILike('nom', `%${search}%`)
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

    const permis = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return permis
  }

  /**
   * Récupérer un permis de conduire par ID
   */
  async getById(id: number) {
    const permis = await PermisDeConduire.findOrFail(id)
    await permis.load('conducteur')
    return permis
  }

  /**
   * Récupérer un permis de conduire par numéro
   */
  async getByNumero(numero: string) {
    const permis = await PermisDeConduire.findByOrFail('numero', numero)
    await permis.load('conducteur')
    return permis
  }

  /**
   * Récupérer le permis de conduire d'un conducteur
   */
  async getByConducteurId(conducteurId: number) {
    const permis = await PermisDeConduire.findByOrFail('conducteurId', conducteurId)
    await permis.load('conducteur')
    return permis
  }

  /**
   * Mettre à jour un permis de conduire
   */
  async update(id: number, updateData: UpdatePermisDeConduireData) {
    const permis = await PermisDeConduire.findOrFail(id)

    // Vérifier si le numéro est déjà utilisé par un autre permis
    if (updateData.numero && updateData.numero !== permis.numero) {
      const existingPermis = await PermisDeConduire.query()
        .where('numero', updateData.numero)
        .whereNot('id', id)
        .first()
      
      if (existingPermis) {
        throw new Error('Ce numéro de permis est déjà utilisé')
      }
    }

    // Vérifier les dates si elles sont fournies
    if (updateData.dateDelivrance && updateData.dateExpiration) {
      if (updateData.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateExpiration) {
      if (updateData.dateExpiration <= permis.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    } else if (updateData.dateDelivrance) {
      if (permis.dateExpiration <= updateData.dateDelivrance) {
        throw new Error('La date d\'expiration doit être postérieure à la date de délivrance')
      }
    }

    // Mettre à jour les champs
    permis.merge(updateData)
    await permis.save()

    // Charger la relation conducteur
    await permis.load('conducteur')

    return permis
  }

  /**
   * Supprimer un permis de conduire
   */
  async delete(id: number) {
    const permis = await PermisDeConduire.findOrFail(id)
    await permis.delete()
  }

  /**
   * Vérifier si un permis est expiré
   */
  async isExpired(id: number): Promise<boolean> {
    const permis = await PermisDeConduire.findOrFail(id)
    const today = DateTime.now().toJSDate()
    return permis.dateExpiration < today
  }

  /**
   * Récupérer les permis expirés
   */
  async getExpired() {
    const today = DateTime.now().toJSDate()
    
    const permisExpires = await PermisDeConduire.query()
      .where('dateExpiration', '<', today)
      .preload('conducteur')
      .orderBy('dateExpiration', 'asc')

    return permisExpires
  }

  /**
   * Récupérer les permis qui expirent bientôt (dans les 30 jours)
   */
  async getExpiringSoon() {
    const today = DateTime.now().toJSDate()
    const thirtyDaysFromNow = DateTime.now().plus({ days: 30 }).toJSDate()
    
    const permisExpirant = await PermisDeConduire.query()
      .where('dateExpiration', '>=', today)
      .where('dateExpiration', '<=', thirtyDaysFromNow)
      .preload('conducteur')
      .orderBy('dateExpiration', 'asc')

    return permisExpirant
  }

  /**
   * Rechercher des permis de conduire
   */
  async search(searchTerm: string) {
    const permis = await PermisDeConduire.query()
      .where((builder) => {
        builder
          .whereILike('numero', `%${searchTerm}%`)
          .orWhereILike('categorie', `%${searchTerm}%`)
          .orWhereHas('conducteur', (conducteurQuery) => {
            conducteurQuery
              .whereILike('prenom', `%${searchTerm}%`)
              .orWhereILike('nom', `%${searchTerm}%`)
          })
      })
      .preload('conducteur')
      .orderBy('createdAt', 'desc')

    return permis
  }

  /**
   * Statistiques des permis de conduire
   */
  async getStats() {
    const totalPermis = await PermisDeConduire.query().count('* as total')
    const permisExpires = await this.getExpired()
    const permisExpirant = await this.getExpiringSoon()
    
    const today = DateTime.now().toJSDate()
    const permisValides = await PermisDeConduire.query()
      .where('dateExpiration', '>=', today)
      .count('* as valides')

    return {
      total: totalPermis[0].$extras.total,
      valides: permisValides[0].$extras.valides,
      expires: permisExpires.length,
      expirant: permisExpirant.length
    }
  }
} 