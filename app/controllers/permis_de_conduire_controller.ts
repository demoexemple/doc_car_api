import { HttpContext } from '@adonisjs/core/http'
import { PermisDeConduireService } from '#services/permis_de_conduire_service'
import { inject } from '@adonisjs/core'
import { createPermisValidator } from '#validators/permis_de_conduire_validator'
import { errors } from '@vinejs/vine'

@inject()
export default class PermisDeConduireController {
  constructor(private permisService: PermisDeConduireService) {}

  /**
   * Créer un nouveau permis de conduire
   */
  async store({ request, response }: HttpContext) {
    try {
      const permisData = request.only([
        'numero', 'categorie', 'dateDelivrance', 'dateExpiration', 
        'documentPdf', 'conducteurId'
      ])
      

      const validPayload=await createPermisValidator.validate(permisData)

      const permis = await this.permisService.create(validPayload)
      
      return response.status(201).json({
        success: true,
        message: 'Permis de conduire créé avec succès',
        data: permis
      })
    } catch (error) {

       if (error instanceof errors.E_VALIDATION_ERROR) {
                    return response.status(422).json({
                    success: false,
                    message: error.messages 
                  })
            }

      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la création du permis de conduire'
      })
    }
  }

  /**
   * Récupérer tous les permis de conduire
   */
  async index({ request, response }: HttpContext) {
    try {
      const { page, limit, search, expired } = request.qs()
      const permis = await this.permisService.getAll({ page, limit, search, expired })
      
      return response.status(200).json({
        success: true,
        data: permis
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des permis de conduire'
      })
    }
  }

  /**
   * Récupérer un permis de conduire par ID
   */
  async show({ params, response }: HttpContext) {
    try {
      const permis = await this.permisService.getById(params.id)
      
      return response.status(200).json({
        success: true,
        data: permis
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Permis de conduire non trouvé'
      })
    }
  }

  /**
   * Récupérer un permis de conduire par numéro
   */
  async showByNumero({ params, response }: HttpContext) {
    try {
      const permis = await this.permisService.getByNumero(params.numero)
      
      return response.status(200).json({
        success: true,
        data: permis
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Permis de conduire non trouvé'
      })
    }
  }

  /**
   * Récupérer le permis de conduire d'un conducteur
   */
  async showByConducteur({ params, response }: HttpContext) {
    try {
      const permis = await this.permisService.getByConducteurId(params.conducteurId)
      
      return response.status(200).json({
        success: true,
        data: permis
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Permis de conduire non trouvé pour ce conducteur'
      })
    }
  }

  /**
   * Mettre à jour un permis de conduire
   */
  async update({ params, request, response }: HttpContext) {
    try {
      const updateData = request.only([
        'numero', 'categorie', 'dateDelivrance', 'dateExpiration', 'documentPdf'
      ])
      
      const permis = await this.permisService.update(params.id, updateData)
      
      return response.status(200).json({
        success: true,
        message: 'Permis de conduire mis à jour avec succès',
        data: permis
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la mise à jour du permis de conduire'
      })
    }
  }

  /**
   * Supprimer un permis de conduire
   */
  async destroy({ params, response }: HttpContext) {
    try {
      await this.permisService.delete(params.id)
      
      return response.status(200).json({
        success: true,
        message: 'Permis de conduire supprimé avec succès'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression du permis de conduire'
      })
    }
  }

  /**
   * Vérifier si un permis est expiré
   */
  async checkExpiration({ params, response }: HttpContext) {
    try {
      const isExpired = await this.permisService.isExpired(params.id)
      
      return response.status(200).json({
        success: true,
        data: { isExpired }
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Permis de conduire non trouvé'
      })
    }
  }

  /**
   * Récupérer les permis expirés
   */
  async getExpired({ response }: HttpContext) {
    try {
      const permisExpires = await this.permisService.getExpired()
      
      return response.status(200).json({
        success: true,
        data: permisExpires
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des permis expirés'
      })
    }
  }

  /**
   * Récupérer les permis qui expirent bientôt
   */
  async getExpiringSoon({ response }: HttpContext) {
    try {
      const permisExpirant = await this.permisService.getExpiringSoon()
      
      return response.status(200).json({
        success: true,
        data: permisExpirant
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des permis expirant bientôt'
      })
    }
  }

  /**
   * Rechercher des permis de conduire
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

      const permis = await this.permisService.search(q)
      
      return response.status(200).json({
        success: true,
        data: permis
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche'
      })
    }
  }

  /**
   * Statistiques des permis de conduire
   */
  async stats({ response }: HttpContext) {
    try {
      const stats = await this.permisService.getStats()
      
      return response.status(200).json({
        success: true,
        data: stats
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques'
      })
    }
  }
} 