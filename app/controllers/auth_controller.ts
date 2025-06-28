import { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { inject } from '@adonisjs/core'
import { registerValidator, updateProfileValidator } from '#validators/auth_validator'
import { errors } from '@vinejs/vine'

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register({ request, response }: HttpContext) {
    try {
      const userData = request.only(['fullName', 'email', 'password', 'role', 'parent'])

      const validPayload= await registerValidator.validate(userData)
      
      const result = await this.authService.register(validPayload)
      
      return response.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: result
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
        message: error.message || 'Erreur lors de la création de l\'utilisateur'
      })
    }
  }

  /**
   * Connexion d'un utilisateur avec protection contre les attaques par timing
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      
      const result = await this.authService.login(email, password)
      
      return response.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result
      })
    } catch (error) {
      // Utiliser le même message d'erreur pour éviter les attaques par timing
      return response.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }
  }

  /**
   * Mise à jour du profil utilisateur
   */
  async update({ request, response, auth }: HttpContext) {
    console.log("ici")
    try {
      const user = auth.user!
      const updateData = request.only(['fullName', 'email', 'role'])

      const validPayload=await updateProfileValidator.validate(updateData)
      
      const result = await this.authService.update(user.id, validPayload)
      
      return response.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: result
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
        message: error.message || 'Erreur lors de la mise à jour'
      })
    }
  }

  /**
   * Changement de mot de passe sécurisé
   */
  async changePassword({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])
      
      await this.authService.changePassword(user.id, currentPassword, newPassword)
      
      return response.status(200).json({
        success: true,
        message: 'Mot de passe modifié avec succès. Vous devez vous reconnecter.'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors du changement de mot de passe'
      })
    }
  }

  /**
   * Déconnexion sécurisée
   */
  async logout({ response, auth }: HttpContext) {
    try {
      await this.authService.logout(auth.user!)
      
      return response.status(200).json({
        success: true,
        message: 'Déconnexion réussie'
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la déconnexion'
      })
    }
  }

  /**
   * Déconnexion de tous les appareils
   */
  // async logoutAllDevices({ response, auth }: HttpContext) {
  //   try {
  //     await this.authService.logoutAllDevices(auth.user!)
      
  //     return response.status(200).json({
  //       success: true,
  //       message: 'Déconnexion de tous les appareils réussie'
  //     })
  //   } catch (error) {
  //     return response.status(500).json({
  //       success: false,
  //       message: 'Erreur lors de la déconnexion'
  //     })
  //   }
  // }

  /**
   * Récupération du profil utilisateur connecté
   */
  async profile({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const profile = await this.authService.getProfile(user.id)
      
      return response.status(200).json({
        success: true,
        data: profile
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      })
    }
  }

  /**
   * Rafraîchir un token d'accès
   */
  async refreshToken({ response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const newToken = await this.authService.refreshToken(user)
      
      return response.status(200).json({
        success: true,
        message: 'Token rafraîchi avec succès',
        data: { token: newToken }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors du rafraîchissement du token'
      })
    }
  }

  /**
   * Vérifier la validité d'un token
   */
  // async validateToken({ request, response }: HttpContext) {
  //   try {
  //     const { token } = request.only(['token'])
  //     const user = await this.authService.validateToken(token)
      
  //     return response.status(200).json({
  //       success: true,
  //       message: 'Token valide',
  //       data: user
  //     })
  //   } catch (error) {
  //     return response.status(401).json({
  //       success: false,
  //       message: 'Token invalide ou expiré'
  //     })
  //   }
  // }

  /**
   * Récupérer tous les utilisateurs (admin seulement)
   */
  async getAllUsers({ response }: HttpContext) {
    try {
      const users = await this.authService.getAllUsers()
      
      return response.status(200).json({
        success: true,
        data: users
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs'
      })
    }
  }

  /**
   * Supprimer un utilisateur (admin seulement)
   */
  async deleteUser({ params, response }: HttpContext) {
    try {
      const userId = params.id
      await this.authService.deleteUser(userId)
      
      return response.status(200).json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la suppression de l\'utilisateur'
      })
    }
  }
} 