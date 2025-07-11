import { HttpContext } from '@adonisjs/core/http'
import { ConducteurService } from '#services/conducteur_service'
import { inject } from '@adonisjs/core'
import { createConducteurValidator } from '#validators/conducteur_validator'
import { errors } from '@vinejs/vine'

@inject()
export default class ConducteurController {
  constructor(private conducteurService: ConducteurService) {}

  /**
   * Créer un nouveau conducteur
   */
  async store({ request, response }: HttpContext) {
    try {
      const conducteurData = request.only([
        'prenom', 'nom', 'adresse', 'telephone', 
        'numCni', 'frontCni', 'backCni', 'profilImage'
      ])

      const validPayload=await createConducteurValidator.validate(conducteurData)
      
      const conducteur = await this.conducteurService.create(validPayload)
      
      return response.status(201).json({
        success: true,
        message: 'Conducteur créé avec succès',
        data: conducteur
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
        message: error.message || 'Erreur lors de la création du conducteur'
      })
    }
  }

  /**
   * Récupérer tous les conducteurs
   */
  async index({ request, response }: HttpContext) {
    try {
      const { page, limit, search } = request.qs()
      const conducteurs = await this.conducteurService.getAll({ page, limit, search })
      
      return response.status(200).json({
        success: true,
        data: conducteurs
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des conducteurs'
      })
    }
  }

  /**
   * Récupérer un conducteur par ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const conducteur = await this.conducteurService.getById(params.id)
      
      return response.status(200).json({
        success: true,
        data: conducteur
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Conducteur non trouvé'
      })
    }
  }

  /**
   * Mettre à jour un conducteur
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const updateData = request.only([
        'prenom', 'nom', 'adresse', 'telephone', 
        'numCni', 'frontCni', 'backCni', 'profilImage'
      ])
      
      const conducteur = await this.conducteurService.update(params.id, updateData)
      
      return response.status(200).json({
        success: true,
        message: 'Conducteur mis à jour avec succès',
        data: conducteur
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du conducteur'
      })
    }
  }

  /**
   * Supprimer un conducteur
   */
  async destroy({ params, response }: HttpContext) {

    console.log("dans le controlleur");

    try {
      await this.conducteurService.delete(params.id)
      
      return response.status(200).json({
        success: true,
        message: 'Conducteur supprimé avec succès'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du conducteur'
      })
    }
  }

  /**
   * Ajouter un véhicule à un conducteur
   */
  async addVehicule({ params, request, response }: HttpContext) {
    try {
      const { vehiculeId } = request.only(['vehiculeId'])
      const conducteur = await this.conducteurService.addVehicule(params.id, vehiculeId)
      
      return response.status(200).json({
        success: true,
        message: 'Véhicule ajouté au conducteur avec succès',
        data: conducteur
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de l\'ajout du véhicule'
      })
    }
  }

  /**
   * Retirer un véhicule d'un conducteur
   */
  async removeVehicule({ params, response }: HttpContext) {
    try {
      const conducteur = await this.conducteurService.removeVehicule(params.id, params.vehiculeId)
      
      return response.status(200).json({
        success: true,
        message: 'Véhicule retiré du conducteur avec succès',
        data: conducteur
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors du retrait du véhicule'
      })
    }
  }

  /**
   * Récupérer les véhicules d'un conducteur
   */
  async getVehicules({ params, response }: HttpContext) {
    try {
      const vehicules = await this.conducteurService.getVehicules(params.id)
      
      return response.status(200).json({
        success: true,
        data: vehicules
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Conducteur non trouvé'
      })
    }
  }

  /**
   * Rechercher des conducteurs
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

      const conducteurs = await this.conducteurService.search(q)
      
      return response.status(200).json({
        success: true,
        data: conducteurs
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche'
      })
    }
  }

  /**
   * Statistiques des conducteurs
   */
  // async stats({ response }: HttpContext) {
  //   try {
  //     const stats = await this.conducteurService.getStats()
      
  //     return response.status(200).json({
  //       success: true,
  //       data: stats
  //     })
  //   } catch (error) {
  //     return response.status(500).json({
  //       success: false,
  //       message: 'Erreur lors de la récupération des statistiques'
  //     })
  //   }
  // }
} 