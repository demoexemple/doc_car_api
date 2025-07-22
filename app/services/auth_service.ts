import { inject } from '@adonisjs/core'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { AccessToken } from '@adonisjs/auth/access_tokens'

export interface UserData {
  fullName?: string
  email: string
  password: string
  role?: string
  parent?: number
}

export interface UpdateUserData {
  fullName?: string
  email?: string
  role?: string
}

@inject()
export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData: UserData) {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findBy('email', userData.email)
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    // Vérifier si le parent existe si spécifié
    // if (userData.parent) {
      const parentUser = await User.find(userData.parent)
      if (!parentUser) {
        throw new Error('L\'utilisateur parent spécifié n\'existe pas')
      }
    // }

    // Créer l'utilisateur
    const user = await User.create({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
    })

   await  user.related('parent').associate(parentUser)

   
    // Charger la relation parent
    await user.load('parent')

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }

  /**
   * Connexion d'un utilisateur avec protection contre les attaques par timing
   */
  async login(email: string, password: string) {
    // Utiliser une vérification à temps constant pour éviter les attaques par timing
    const user = await User.findBy('email', email)
    
    // Si l'utilisateur n'existe pas, on simule quand même la vérification du mot de passe
    // pour éviter de révéler l'existence de l'email
    if (!user) {
      // Hash d'un mot de passe factice pour maintenir un temps de réponse constant
      await hash.verify('$2b$10$fake.hash.for.timing.attack.protection', password)
      throw new Error('Email ou mot de passe incorrect')
    }

    // Vérifier le mot de passe avec une vérification à temps constant
    const isValidPassword = await hash.verify(user.password, password)
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Créer un token d'accès avec une durée d'expiration
    const token = await User.accessTokens.create(user, ['*'], { 
      expiresIn: '24 hours' 
    })

    // Charger la relation parent
    // await user.load('parent')

    // Retourner l'utilisateur et le token
    const { password: userPassword, ...userWithoutPassword } = user.toJSON()
    return {
      user: userWithoutPassword,
      token: token
    }
  }

  /**
   * Mise à jour du profil utilisateur
   */
  async update(userId: number, updateData: UpdateUserData) {
    const user = await User.findOrFail(userId)

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.query()
        .where('email', updateData.email)
        .whereNot('id', userId)
        .first()
      
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé par un autre utilisateur')
      }
    }

    // Mettre à jour les champs
    user.merge(updateData)
    await user.save()

    // Charger la relation parent
    await user.load('parent')

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }

  /**
   * Changement de mot de passe avec vérification sécurisée
   */
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await User.findOrFail(userId)


    // Vérifier l'ancien mot de passe avec une vérification à temps constant
    const isValidPassword = await hash.verify(user.password, currentPassword)



    if (!isValidPassword) {
      throw new Error('Le mot de passe actuel est incorrect')
    }

    

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isSamePassword = await hash.verify(user.password, newPassword)
    if (isSamePassword) {
      throw new Error('Le nouveau mot de passe doit être différent de l\'actuel')
    }

    // Mettre à jour le mot de passe
    user.password = newPassword
    await user.save()

    // Invalider tous les tokens existants pour forcer une nouvelle connexion
    // await User.accessTokens.delete(user)
  }

  /**
   * Déconnexion sécurisée
   */
  async logout(user: User & {currentAccessToken: AccessToken;}) {
    // Supprimer le token actuel
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
  }

  /**
   * Déconnexion de tous les appareils
   */
  // async logoutAllDevices(user: User) {
  //   // Supprimer tous les tokens d'accès de l'utilisateur
  //   await User.accessTokens.delete(user)
  // }

  /**
   * Récupération du profil utilisateur
   */
  async getProfile(userId: number) {
    const user = await User.findOrFail(userId)
    
    // Charger la relation parent
    await user.load('parent')

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user.toJSON()
    return userWithoutPassword
  }

  /**
   * Vérifier si un utilisateur existe
   */
  async userExists(userId: number): Promise<boolean> {
    const user = await User.find(userId)
    return !!user
  }

  /**
   * Récupérer tous les utilisateurs (pour les administrateurs)
   */
  async getAllUsers() {
    const users = await User.query()
      .preload('parent')
      .orderBy('createdAt', 'desc')

    return users.map(user => {
      const { password, ...userWithoutPassword } = user.toJSON()
      return userWithoutPassword
    })
  }

  /**
   * Supprimer un utilisateur (pour les administrateurs)
   */
  async deleteUser(userId: number) {
    const user = await User.findOrFail(userId)
    
    // Supprimer tous les tokens d'accès avant de supprimer l'utilisateur
    // await User.accessTokens.delete(user)
    
    await user.delete()
  }

  /**
   * Rafraîchir un token d'accès
   */
  async refreshToken(user: User & {currentAccessToken: AccessToken;}) {
    // Supprimer l'ancien token
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    // Créer un nouveau token
    const token = await User.accessTokens.create(user, ['*'], { 
      expiresIn: '24 hours' 
    })

    return token.value
  }

  /**
   * Vérifier la validité d'un token
   */
  // async validateToken(tokenValue: Secret<string>) {
  //   try {
  //     const token = await User.accessTokens.verify(tokenValue)
  //     const user = await User.find(token.userId)
      
  //     // Charger la relation parent
  //     await user.load('parent')
      
  //     const { password, ...userWithoutPassword } = user.toJSON()
  //     return userWithoutPassword
  //   } catch (error) {
  //     throw new Error('Token invalide ou expiré')
  //   }
  // }
} 