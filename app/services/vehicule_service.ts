import { inject } from '@adonisjs/core'
import Vehicule from '#models/Vehicule'
import User from '#models/user'
import Conducteur from '#models/Conducteur'

export interface VehiculeData {
  marque: string
  modele: string
  type: string
  usages?: string
  proprietaireId: number
}

export interface UpdateVehiculeData {
  marque?: string
  modele?: string
  type?: string
  usages?: string
  immatriculation?: string
  annee?: number
  couleur?: string
  proprietaireId?: number
}

export interface VehiculeStats {
  total: number
  parType: Record<string, number>
  parMarque: Record<string, number>
  recents: number
  // parAnnee: Record<string, number>
}

@inject()
export class VehiculeService {
  /**
   * Créer un nouveau véhicule
   */
  async create(vehiculeData: VehiculeData) {
    // Vérifier si le propriétaire existe
    const proprietaire = await Conducteur.find(vehiculeData.proprietaireId)
    if (!proprietaire) {
      throw new Error('Le propriétaire spécifié n\'existe pas')
    }

       

    // Créer le véhicule
    const vehicule = await Vehicule.create(vehiculeData)

    // await vehicule.related('proprietaire').associate(proprietaire)

    await vehicule.related('conducteurs').attach([vehiculeData.proprietaireId])

    // Charger les relations
    await vehicule.load('proprietaire')
    await vehicule.load('conducteurs')

    return vehicule
  }

  /**
   * Récupérer tous les véhicules
   */
  async getAll(query?: { page?: number; limit?: number; search?: string; type?: string; marque?: string }) {
    const page = query?.page || 1
    const limit = query?.limit || 10
    const search = query?.search
    const type = query?.type
    const marque = query?.marque

    let queryBuilder = Vehicule.query()
      .preload('proprietaire')
      .preload('conducteurs')
      .preload('carteGrise')

    if (search) {
      queryBuilder = queryBuilder.where((builder) => {
        builder
          .whereILike('marque', `%${search}%`)
          .orWhereILike('modele', `%${search}%`)
          .orWhereILike('immatriculation', `%${search}%`)
          .orWhereILike('type', `%${search}%`)
          .orWhereHas('proprietaire', (proprietaireQuery) => {
            proprietaireQuery
              .whereILike('prenom', `%${search}%`)
              .orWhereILike('nom', `%${search}%`)
          })
      })
    }

    if (type) {
      queryBuilder = queryBuilder.where('type', type)
    }

    if (marque) {
      queryBuilder = queryBuilder.where('marque', marque)
    }

    const vehicules = await queryBuilder
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return vehicules
  }

  /**
   * Récupérer un véhicule par ID
   */
  async getById(id: number) {
    const vehicule = await Vehicule.findOrFail(id)
    
    // Charger les relations
    await vehicule.load('proprietaire')
    await vehicule.load('conducteurs')

    return vehicule
  }

  /**
   * Récupérer un véhicule par immatriculation
   */
  async getByImmatriculation(immatriculation: string) {
    const vehicule = await Vehicule.findByOrFail('immatriculation', immatriculation)
    
    // Charger les relations
    await vehicule.load('proprietaire')
    await vehicule.load('conducteurs')

    return vehicule
  }

  /**
   * Récupérer les véhicules d'un propriétaire
   */
  async getByProprietaireId(proprietaireId: number) {
    const vehicules = await Vehicule.query()
      .where('proprietaireId', proprietaireId)
      .preload('proprietaire')
      .preload('conducteurs')
      .orderBy('createdAt', 'desc')

    return vehicules
  }

  /**
   * Mettre à jour un véhicule
   */
  async update(id: number, updateData: UpdateVehiculeData) {
    const vehicule = await Vehicule.findOrFail(id)

    // Vérifier si l'immatriculation est déjà utilisée par un autre véhicule
    if (updateData.immatriculation && updateData.immatriculation ) {
      const existingVehicule = await Vehicule.query()
        .where('id', id)
        .first()
      
      if (existingVehicule) {
        throw new Error('Cette immatriculation est déjà utilisée par un autre véhicule')
      }
    }

    // Vérifier le propriétaire si fourni
    if (updateData.proprietaireId) {
      const proprietaire = await User.find(updateData.proprietaireId)
      if (!proprietaire) {
        throw new Error('Le propriétaire spécifié n\'existe pas')
      }
    }

    // Vérifier l'année si fournie
    if (updateData.annee !== undefined) {
      if (updateData.annee < 1900 || updateData.annee > new Date().getFullYear() + 1) {
        throw new Error('L\'année doit être entre 1900 et l\'année prochaine')
      }
    }

    // Mettre à jour les champs
    vehicule.merge(updateData)
    await vehicule.save()

    // Charger les relations
    await vehicule.load('proprietaire')
    await vehicule.load('conducteurs')

    return vehicule
  }

  /**
   * Mettre à jour un véhicule avec toutes ses relations
   */
  async updateWithRelations(id: number, payload: any) {
    // Mettre à jour le véhicule principal
    const vehicule = await this.update(id, payload)

    // Mettre à jour la carte grise si présente
    if (payload.carteGrise && payload.carteGrise.id) {
      const carteGriseService = await import('./carte_grise_service.js').then(m => new m.CarteGriseService())
      await carteGriseService.update(payload.carteGrise.id, payload.carteGrise)
    }
    // Mettre à jour l'assurance si présente
    if (payload.assurance && payload.assurance.id) {
      const assuranceService = await import('./assurance_service.js').then(m => new m.AssuranceService())
      await assuranceService.update(payload.assurance.id, payload.assurance)
    }
    // Mettre à jour la vignette si présente
    if (payload.vignette && payload.vignette.id) {
      const vignetteService = await import('./vignette_service.js').then(m => new m.VignetteService())
      await vignetteService.update(payload.vignette.id, payload.vignette)
    }
    // Mettre à jour la visite technique si présente
    if (payload.visiteTechnique && payload.visiteTechnique.id) {
      const visiteTechniqueService = await import('./visite_technique_service.js').then(m => new m.VisiteTechniqueService())
      await visiteTechniqueService.update(payload.visiteTechnique.id, payload.visiteTechnique)
    }
    // Mettre à jour la carte bleue si présente
    if (payload.carteBleue && payload.carteBleue.id) {
      const carteBleueService = await import('./carte_bleue_service.js').then(m => new m.CarteBleueService())
      await carteBleueService.update(payload.carteBleue.id, payload.carteBleue)
    }
    // Recharger toutes les relations
    await vehicule.load('proprietaire')
    await vehicule.load('conducteurs')
    await vehicule.load('carteGrise')
    await vehicule.load('assurance')
    await vehicule.load('vignette')
    await vehicule.load('visiteTechnique')
    await vehicule.load('carteBleue')
    return vehicule
  }

  /**
   * Supprimer un véhicule
   */
  async delete(id: number) {
    const vehicule = await Vehicule.findOrFail(id)
    
    // Détacher tous les conducteurs avant de supprimer
    await vehicule.related('conducteurs').detach()
    
    await vehicule.delete()
  }

  /**
   * Ajouter un conducteur à un véhicule
   */
  async addConducteur(vehiculeId: number, conducteurId: number) {
    const vehicule = await Vehicule.findOrFail(vehiculeId)
    const conducteur = await Conducteur.findOrFail(conducteurId)

    // Vérifier si la relation existe déjà
    const existingRelation = await vehicule.related('conducteurs').query()
      .where('conducteur_id', conducteurId)
      .first()

    if (existingRelation) {
      throw new Error('Ce conducteur est déjà associé à ce véhicule')
    }

    // Créer la relation
    await vehicule.related('conducteurs').attach([conducteurId])

    // Recharger les relations
    await vehicule.load('conducteurs')

    return vehicule
  }

  /**
   * Retirer un conducteur d'un véhicule
   */
  async removeConducteur(vehiculeId: number, conducteurId: number) {
    const vehicule = await Vehicule.findOrFail(vehiculeId)

    // Vérifier si la relation existe
    const existingRelation = await vehicule.related('conducteurs').query()
      .where('conducteur_id', conducteurId)
      .first()

    if (!existingRelation) {
      throw new Error('Ce conducteur n\'est pas associé à ce véhicule')
    }

    // Supprimer la relation
    await vehicule.related('conducteurs').detach([conducteurId])

    // Recharger les relations
    await vehicule.load('conducteurs')

    return vehicule
  }

  /**
   * Récupérer les conducteurs d'un véhicule
   */
  async getConducteurs(vehiculeId: number) {
    const vehicule = await Vehicule.findOrFail(vehiculeId)
    await vehicule.load('conducteurs')
    return vehicule.conducteurs
  }

  /**
   * Rechercher des véhicules
   */
  async search(searchTerm: string) {
    const vehicules = await Vehicule.query()
      .where((builder) => {
        builder
          .whereILike('marque', `%${searchTerm}%`)
          .orWhereILike('modele', `%${searchTerm}%`)
          .orWhereILike('immatriculation', `%${searchTerm}%`)
          .orWhereILike('type', `%${searchTerm}%`)
          .orWhereHas('proprietaire', (proprietaireQuery) => {
            proprietaireQuery
              .whereILike('prenom', `%${searchTerm}%`)
              .orWhereILike('nom', `%${searchTerm}%`)
          })
      })
      .preload('proprietaire')
      .preload('conducteurs')
      .orderBy('createdAt', 'desc')

    return vehicules
  }

  /**
   * Récupérer les véhicules par type
   */
  async getByType(type: string) {
    const vehicules = await Vehicule.query()
      .where('type', type)
      .preload('proprietaire')
      .preload('conducteurs')
      .orderBy('createdAt', 'desc')

    return vehicules
  }

  /**
   * Récupérer les véhicules par marque
   */
  async getByMarque(marque: string) {
    const vehicules = await Vehicule.query()
      .where('marque', marque)
      .preload('proprietaire')
      .preload('conducteurs')
      .orderBy('createdAt', 'desc')

    return vehicules
  }

  /**
   * Récupérer les véhicules récents (créés dans les 30 derniers jours)
   */
  async getRecents() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const vehicules = await Vehicule.query()
      .where('createdAt', '>=', thirtyDaysAgo)
      .preload('proprietaire')
      .preload('conducteurs')
      .orderBy('createdAt', 'desc')

    return vehicules
  }

  /**
   * Statistiques des véhicules
   */
  async getStats(): Promise<VehiculeStats> {
    const totalVehicules = await Vehicule.query().count('* as total') as unknown as Array<{ $extras: { total: number } }>
    
    // Statistiques par type
    const types = await Vehicule.query()
      .select('type')
      .count('* as count')
      .groupBy('type') as unknown as Array<{ type: string; $extras: { count: number } }>

    // Statistiques par marque
    const marques = await Vehicule.query()
      .select('marque')
      .count('* as count')
      .groupBy('marque')
      .orderBy('count', 'desc')
      .limit(10) as unknown as Array<{ marque: string; $extras: { count: number } }>

    // Véhicules récents
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const vehiculesRecents = await Vehicule.query()
      .where('createdAt', '>=', thirtyDaysAgo)
      .count('* as recents') as unknown as Array<{ $extras: { recents: number } }>

    // Véhicules par année
    // const vehiculesParAnnee = await Vehicule.query()
    //   .select('annee')
    //   .count('* as count')
    //   .groupBy('annee')
    //   .orderBy('annee', 'desc') as unknown as Array<{ annee: number; $extras: { count: number } }>

    return {
      total: totalVehicules[0].$extras.total,
      parType: types.reduce((acc, type) => {
        acc[type.type] = type.$extras.count
        return acc
      }, {} as Record<string, number>),
      parMarque: marques.reduce((acc, marque) => {
        acc[marque.marque] = marque.$extras.count
        return acc
      }, {} as Record<string, number>),
      recents: vehiculesRecents[0].$extras.recents,
      // parAnnee: vehiculesParAnnee.reduce((acc, annee) => {
      //   acc[annee.annee.toString()] = annee.$extras.count
      //   return acc
      // }, {} as Record<string, number>)
    }
  }
} 