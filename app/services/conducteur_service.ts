import { inject } from '@adonisjs/core'
import Conducteur from '#models/Conducteur'
import Vehicule from '#models/Vehicule'
import PermisDeConduire from '#models/PermisDeConduire'

export interface ConducteurData {
  prenom: string
  nom: string
  adresse?: string
  telephone: string
  numCNI: string
  frontCni?: string
  backCni?: string
  profilImage?: string
}

export interface UpdateConducteurData {
  prenom?: string
  nom?: string
  adresse?: string
  telephone?: string
  numCNI?: string
  frontCni?: string
  backCni?: string
  profilImage?: string
}

@inject()
export class ConducteurService {
  /**
   * Créer un nouveau conducteur
   */
  async create(conducteurData: ConducteurData) {
    // Vérifier si le numéro CNI existe déjà
    const existingConducteur = await Conducteur.findBy('numCNI', conducteurData.numCNI)
    if (existingConducteur) {
      throw new Error('Un conducteur avec ce numéro CNI existe déjà')
    }

    // Vérifier si le téléphone existe déjà
    const existingPhone = await Conducteur.findBy('telephone', conducteurData.telephone)
    if (existingPhone) {
      throw new Error('Un conducteur avec ce numéro de téléphone existe déjà')
    }

    // Créer le conducteur
    const conducteur = await Conducteur.create(conducteurData)

    // Charger les relations
    await conducteur.load('vehicules')
    await conducteur.load('permisDeConduire')

    return conducteur
  }

  /**
   * Récupérer tous les conducteurs
   */
  async getAll(query?: { page?: number; limit?: number; search?: string }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search

    let queryBuilder = Conducteur.query()
      .preload('vehicules')
      .preload('permisDeConduire')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('prenom', `%${search}%`)
          .orWhereILike('nom', `%${search}%`)
          .orWhereILike('numCNI', `%${search}%`)
          .orWhereILike('telephone', `%${search}%`)
      })
    }

    const conducteurs = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return conducteurs
  }

  /**
   * Récupérer un conducteur par ID
   */
  async getById(id: number) {
    const conducteur = await Conducteur.findOrFail(id)
    
    // Charger les relations avec les relations imbriquées des véhicules
    await conducteur.load('vehicules', (query) => {
      query.preload('assurance')
      query.preload('carteBleue')
      query.preload('vignette')
      query.preload('visiteTechnique')
    })
    await conducteur.load('permisDeConduire')

    return conducteur
  }

  /**
   * Mettre à jour un conducteur
   */
  async update(id: number, updateData: UpdateConducteurData) {
    const conducteur = await Conducteur.findOrFail(id)

    // Vérifier si le numéro CNI est déjà utilisé par un autre conducteur
    if (updateData.numCNI && updateData.numCNI !== conducteur.numCNI) {
      const existingConducteur = await Conducteur.query()
        .where('numCNI', updateData.numCNI)
        .whereNot('id', id)
        .first()
      
      if (existingConducteur) {
        throw new Error('Ce numéro CNI est déjà utilisé par un autre conducteur')
      }
    }

    // Vérifier si le téléphone est déjà utilisé par un autre conducteur
    if (updateData.telephone && updateData.telephone !== conducteur.telephone) {
      const existingPhone = await Conducteur.query()
        .where('telephone', updateData.telephone)
        .whereNot('id', id)
        .first()
      
      if (existingPhone) {
        throw new Error('Ce numéro de téléphone est déjà utilisé par un autre conducteur')
      }
    }

    // Mettre à jour les champs
    conducteur.merge(updateData)
    await conducteur.save()

    // Charger les relations
    await conducteur.load('vehicules')
    await conducteur.load('permisDeConduire')

    return conducteur
  }

  /**
   * Supprimer un conducteur
   */
  async delete(id: number) {
    const conducteur = await Conducteur.findOrFail(id)
    
    // Détacher tous les véhicules avant de supprimer
    await conducteur.related('vehicules').detach()
    
    await conducteur.delete()
  }

  /**
   * Ajouter un véhicule à un conducteur
   */
  async addVehicule(conducteurId: number, vehiculeId: number) {
    const conducteur = await Conducteur.findOrFail(conducteurId)
    const vehicule = await Vehicule.findOrFail(vehiculeId)

    // Vérifier si la relation existe déjà
    const existingRelation = await conducteur.related('vehicules').query()
      .where('vehicule_id', vehiculeId)
      .first()

    if (existingRelation) {
      throw new Error('Ce conducteur est déjà associé à ce véhicule')
    }

    // Créer la relation
    await conducteur.related('vehicules').attach([vehiculeId])

    // Recharger les relations
    await conducteur.load('vehicules')

    return conducteur
  }

  /**
   * Retirer un véhicule d'un conducteur
   */
  async removeVehicule(conducteurId: number, vehiculeId: number) {
    const conducteur = await Conducteur.findOrFail(conducteurId)

    // Vérifier si la relation existe
    const existingRelation = await conducteur.related('vehicules').query()
      .where('vehicule_id', vehiculeId)
      .first()

    if (!existingRelation) {
      throw new Error('Ce conducteur n\'est pas associé à ce véhicule')
    }

    // Supprimer la relation
    await conducteur.related('vehicules').detach([vehiculeId])

    // Recharger les relations
    await conducteur.load('vehicules')

    return conducteur
  }

  /**
   * Récupérer les véhicules d'un conducteur
   */
  async getVehicules(conducteurId: number) {
    const conducteur = await Conducteur.findOrFail(conducteurId)
    await conducteur.load('vehicules')
    return conducteur.vehicules
  }

  /**
   * Rechercher des conducteurs
   */
  async search(searchTerm: string) {
    const conducteurs = await Conducteur.query()
      .where((builder) => {
        builder
          .whereILike('prenom', `%${searchTerm}%`)
          .orWhereILike('nom', `%${searchTerm}%`)
          .orWhereILike('numCNI', `%${searchTerm}%`)
          .orWhereILike('telephone', `%${searchTerm}%`)
      })
      .preload('vehicules')
      .preload('permisDeConduire')
      .orderBy('createdAt', 'desc')

    return conducteurs
  }

  /**
   * Statistiques des conducteurs
   */
  // async getStats() {
  //   const totalConducteurs = await Conducteur.query().count('* as total')
  //   const conducteursAvecPermis = await Conducteur.query()
  //     .whereHas('permisDeConduire')
  //     .count('* as avec_permis')
  //   const conducteursSansPermis = await Conducteur.query()
  //     .whereDoesntHave('permisDeConduire')
  //     .count('* as sans_permis')

  //   return {
  //     total: totalConducteurs[0].$extras.total,
  //     avecPermis: conducteursAvecPermis[0].$extras.avec_permis,
  //     sansPermis: conducteursSansPermis[0].$extras.sans_permis
  //   }
  // }
} 