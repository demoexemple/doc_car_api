import vine from '@vinejs/vine'

/**
 * Validateur pour l'inscription d'un utilisateur
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().trim().minLength(8).maxLength(255),
    role: vine.string().trim().in(['admin', 'user', 'manager']).optional(),
    parent: vine.number().positive().optional()
  })
)

/**
 * Validateur pour la connexion
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().trim().minLength(1).maxLength(255)
  })
)

/**
 * Validateur pour la mise à jour du profil
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().maxLength(255).optional(),
    role: vine.string().trim().in(['admin', 'user', 'manager']).optional()
  })
)

/**
 * Validateur pour le changement de mot de passe
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().trim().minLength(1).maxLength(255),
    newPassword: vine.string().trim().minLength(8).maxLength(255)
  })
) 