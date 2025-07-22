// import vine from '@vinejs/vine'

// /**
//  * Validateur de mot de passe sécurisé
//  */
// export const passwordValidator = vine.compile(
//   vine.object({
//     password: vine
//       .string()
//       .trim()
//       .minLength(3)
//       .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial')
//   })
// )

// /**
//  * Liste des mots de passe communs à éviter
//  */
// const commonPasswords = [
//   'password', '123456', '123456789', 'qwerty', 'abc123',
//   'password123', 'admin', 'letmein', 'welcome', 'monkey',
//   '1234567890', '12345678', '1234567', '12345678910'
// ]

// /**
//  * Vérifier si un mot de passe est dans la liste des mots de passe communs
//  */
// export function isCommonPassword(password: string): boolean {
//   return commonPasswords.includes(password.toLowerCase())
// }

// /**
//  * Validateur complet de mot de passe avec vérifications avancées
//  */
// export async function validatePassword(password: string): Promise<{ isValid: boolean; errors: string[] }> {
//   const errors: string[] = []
  
//   // Vérifications de base
//   if (password.length < config.passwordPolicy.minLength) {
//     errors.push(`Le mot de passe doit contenir au moins ${config.passwordPolicy.minLength} caractères`)
//   }
  
//   if (password.length > config.passwordPolicy.maxLength) {
//     errors.push(`Le mot de passe ne peut pas dépasser ${config.passwordPolicy.maxLength} caractères`)
//   }
  
//   // Vérifications de complexité
//   if (config.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
//     errors.push('Le mot de passe doit contenir au moins une lettre majuscule')
//   }
  
//   if (config.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
//     errors.push('Le mot de passe doit contenir au moins une lettre minuscule')
//   }
  
//   if (config.passwordPolicy.requireNumbers && !/\d/.test(password)) {
//     errors.push('Le mot de passe doit contenir au moins un chiffre')
//   }
  
//   if (config.passwordPolicy.requireSpecialChars && !/[@$!%*?&]/.test(password)) {
//     errors.push('Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)')
//   }
  
//   // Vérification des mots de passe communs
//   if (config.passwordPolicy.preventCommonPasswords && isCommonPassword(password)) {
//     errors.push('Ce mot de passe est trop commun, veuillez en choisir un autre')
//   }
  
//   return {
//     isValid: errors.length === 0,
//     errors
//   }
// } 