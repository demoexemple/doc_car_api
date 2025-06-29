import { HttpContext } from '@adonisjs/core/http'
import { VehiculeService } from '#services/vehicule_service'
import { CarteGriseService } from '#services/carte_grise_service'
import { AssuranceService } from '#services/assurance_service'
import { VignetteService } from '#services/vignette_service'
import { VisiteTechniqueService } from '#services/visite_technique_service'
import { CarteBleueService } from '#services/carte_bleue_service'
import { inject } from '@adonisjs/core'
import { createVehiculeValidator, createVehiculeWithAllValidator } from '#validators/vehicule_validator'
import { errors } from '@vinejs/vine'
import type { CarteGriseData } from '#services/carte_grise_service'
import type { AssuranceData } from '#services/assurance_service'
import type { VignetteData } from '#services/vignette_service'
import type { VisiteTechniqueData } from '#services/visite_technique_service'
import type { CarteBleueData } from '#services/carte_bleue_service'
import Vehicule from '#models/Vehicule'
import CarteGrise from '#models/CarteGrise'
import Assurance from '#models/Assurance'
import Vignette from '#models/Vignette'
import VisiteTechnique from '#models/VisiteTechnique'
import CarteBleue from '#models/CarteBleue'


@inject()
export default class VehiculeController {
  constructor(
    private vehiculeService: VehiculeService,
    private carteGriseService: CarteGriseService,
    private assuranceService: AssuranceService,
    private vignetteService: VignetteService,
    private visiteTechniqueService: VisiteTechniqueService,
    private carteBleueService: CarteBleueService
  ) { }

  /**
   * Créer un véhicule avec tous ses éléments associés
   */
  async store({ request, response }: HttpContext) {
    try {
      const vehiculeData = request.only([
        'marque', 'modele', 'type', 'usages', 'proprietaireId'
      ])

      await createVehiculeWithAllValidator.validate(request.all())

      // Validation des données du véhicule
      const validVehiculeData = await createVehiculeValidator.validate(vehiculeData)

      // Récupérer les données des éléments associés
      const carteGriseData = request.input('carteGrise') as CarteGriseData | null
      const assuranceData = request.input('assurance') as AssuranceData | null
      const vignetteData = request.input('vignette') as VignetteData | null
      const visiteTechniqueData = request.input('visiteTechnique') as VisiteTechniqueData | null
      const carteBleueData = request.input('carteBleue') as CarteBleueData | null

      // Créer le véhicule
      const vehicule = await this.vehiculeService.create(validVehiculeData)

      const result: {
        vehicule: Vehicule
        carteGrise: CarteGrise | null
        assurance: Assurance | null
        vignette: Vignette | null
        visiteTechnique: VisiteTechnique | null
        carteBleue: CarteBleue | null
      } = {
        vehicule,
        carteGrise: null,
        assurance: null,
        vignette: null,
        visiteTechnique: null,
        carteBleue: null
      }

      // Créer la carte grise si fournie
      if (carteGriseData) {
        try {
          result.carteGrise = await this.carteGriseService.create({
            ...carteGriseData,
            vehiculeId: vehicule.id
          })
        } catch (error) {
          console.error('Erreur création carte grise:', error.message)
        }
      }

      // Créer l'assurance si fournie
      if (assuranceData) {
        try {
          result.assurance = await this.assuranceService.create({
            ...assuranceData,
            vehiculeId: vehicule.id
          })
        } catch (error) {
          console.error('Erreur création assurance:', error.message)
        }
      }

      // Créer la vignette si fournie
      if (vignetteData) {
        try {
          result.vignette = await this.vignetteService.create({
            ...vignetteData,
            vehiculeId: vehicule.id
          })
        } catch (error) {
          console.error('Erreur création vignette:', error.message)
        }
      }

      // Créer la visite technique si fournie
      if (visiteTechniqueData) {
        try {
          result.visiteTechnique = await this.visiteTechniqueService.create({
            ...visiteTechniqueData,
            vehiculeId: vehicule.id
          })
        } catch (error) {
          console.error('Erreur création visite technique:', error.message)
        }
      }

      // Créer la carte bleue si fournie
      if (carteBleueData) {
        try {
          result.carteBleue = await this.carteBleueService.create({
            ...carteBleueData,
            vehiculeId: vehicule.id
          })
        } catch (error) {
          console.error('Erreur création carte bleue:', error.message)
        }
      }

      return response.status(201).json({
        success: true,
        message: 'Véhicule créé avec succès',
        data: result
      })
    } catch (error) {
      console.log(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return response.status(422).json({
          success: false,
          message: error.messages
        })
      }

      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création du véhicule'
      })
    }
  }

  /**
   * Récupérer tous les véhicules
   */
  async index({ request, response }: HttpContext) {
    try {
      const { page, limit, search } = request.qs()
      const vehicules = await this.vehiculeService.getAll({ page, limit, search })

      return response.status(200).json({
        success: true,
        data: vehicules
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des véhicules'
      })
    }
  }

  /**
   * Récupérer un véhicule par ID avec tous ses éléments
   */
  async show({ params, response }: HttpContext) {
    try {
      const vehicule = await this.vehiculeService.getById(params.id)

      // Charger tous les éléments associés
      const result: {
        vehicule: Vehicule
        carteGrise: CarteGrise | null
        assurance: Assurance | null
        vignette: Vignette | null
        visiteTechnique: VisiteTechnique | null
        carteBleue: CarteBleue | null
      } = {
        vehicule,
        carteGrise: null,
        assurance: null,
        vignette: null,
        visiteTechnique: null,
        carteBleue: null
      }

      try {
        result.carteGrise = await this.carteGriseService.getByVehiculeId(params.id)
      } catch (error) {
        // Pas de carte grise trouvée
      }

      try {
        result.assurance = await this.assuranceService.getActiveByVehiculeId(params.id)
      } catch (error) {
        // Pas d'assurance active trouvée
      }

      try {
        result.vignette = await this.vignetteService.getActiveByVehiculeId(params.id)
      } catch (error) {
        // Pas de vignette active trouvée
      }

      try {
        result.visiteTechnique = await this.visiteTechniqueService.getActiveByVehiculeId(params.id)
      } catch (error) {
        // Pas de visite technique active trouvée
      }

      try {
        result.carteBleue = await this.carteBleueService.getActiveByVehiculeId(params.id)
      } catch (error) {
        // Pas de carte bleue active trouvée
      }

      return response.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      })
    }
  }

  /**
   * Mettre à jour un véhicule
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const updateData = request.only([
        'marque', 'modele', 'type', 'usages', 'immatriculation',
        'annee', 'couleur', 'proprietaireId'
      ])

      const vehicule = await this.vehiculeService.update(params.id, updateData)

      return response.status(200).json({
        success: true,
        message: 'Véhicule mis à jour avec succès',
        data: vehicule
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du véhicule'
      })
    }
  }

  /**
   * Supprimer un véhicule
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.vehiculeService.delete(params.id)

      return response.status(200).json({
        success: true,
        message: 'Véhicule supprimé avec succès'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du véhicule'
      })
    }
  }

  /**
   * Ajouter un conducteur à un véhicule
   */
  async addConducteur({ params, request, response }: HttpContext) {
    try {
      const { conducteurId } = request.only(['conducteurId'])
      const vehicule = await this.vehiculeService.addConducteur(params.id, conducteurId)

      return response.status(200).json({
        success: true,
        message: 'Conducteur ajouté au véhicule avec succès',
        data: vehicule
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de l\'ajout du conducteur'
      })
    }
  }

  /**
   * Retirer un conducteur d'un véhicule
   */
  async removeConducteur({ params, response }: HttpContext) {
    try {
      const vehicule = await this.vehiculeService.removeConducteur(params.id, params.conducteurId)

      return response.status(200).json({
        success: true,
        message: 'Conducteur retiré du véhicule avec succès',
        data: vehicule
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors du retrait du conducteur'
      })
    }
  }

  /**
   * Récupérer les conducteurs d'un véhicule
   */
  async getConducteurs({ params, response }: HttpContext) {
    try {
      const conducteurs = await this.vehiculeService.getConducteurs(params.id)

      return response.status(200).json({
        success: true,
        data: conducteurs
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      })
    }
  }

  /**
   * Rechercher des véhicules
   */
  async search({ request, response }: HttpContext) {
    try {
      const { q } = request.qs()
      if (!q) {
        return response.status(400).json({
          success: false,
          message: 'Le terme de recherche est requis'
        })
      }

      const vehicules = await this.vehiculeService.search(q)

      return response.status(200).json({
        success: true,
        data: vehicules
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche'
      })
    }
  }

  /**
   * Récupérer les statistiques des véhicules
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.vehiculeService.getStats()

      return response.status(200).json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      })
    }
  }

  /**
   * Récupérer l'historique complet d'un véhicule
   */
  async getHistorique({ params, response }: HttpContext) {
    try {
      const vehicule = await this.vehiculeService.getById(params.id)

      const historique: {
        vehicule: Vehicule
        carteGrise: CarteGrise[]
        assurances: Assurance[]
        vignettes: Vignette[]
        visitesTechniques: VisiteTechnique[]
        cartesBleues: CarteBleue[]
      } = {
        vehicule,
        carteGrise: await this.carteGriseService.getAllByVehiculeId(params.id),
        assurances: await this.assuranceService.getAllByVehiculeId(params.id),
        vignettes: await this.vignetteService.getAllByVehiculeId(params.id),
        visitesTechniques: await this.visiteTechniqueService.getAllByVehiculeId(params.id),
        cartesBleues: await this.carteBleueService.getAllByVehiculeId(params.id)
      }

      return response.status(200).json({
        success: true,
        data: historique
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Véhicule non trouvé'
      })
    }
  }
} 