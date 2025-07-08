import vine from '@vinejs/vine'

/**
 * Validateur pour la création d'un conducteur
 */
export const createConducteurValidator = vine.compile(
  vine.object({
    prenom: vine.string().trim().minLength(2).maxLength(100),
    nom: vine.string().trim().minLength(2).maxLength(100),
    adresse: vine.string().trim().maxLength(255).optional(),
    telephone: vine.string().trim().minLength(8).maxLength(20),
    numCni: vine.string().trim().minLength(5).maxLength(50),
    frontCni: vine.string().trim().maxLength(255).optional(),
    backCni: vine.string().trim().maxLength(255).optional(),
    profilImage: vine.string().trim().maxLength(255).optional()
  })
)

/**
 * Validateur pour la mise à jour d'un conducteur
 */
export const updateConducteurValidator = vine.compile(
  vine.object({
    prenom: vine.string().trim().minLength(2).maxLength(100).optional(),
    nom: vine.string().trim().minLength(2).maxLength(100).optional(),
    adresse: vine.string().trim().maxLength(255).optional(),
    telephone: vine.string().trim().minLength(8).maxLength(20).optional(),
    numCni: vine.string().trim().minLength(5).maxLength(50).optional(),
    frontCni: vine.string().trim().maxLength(255).optional(),
    backCni: vine.string().trim().maxLength(255).optional(),
    profilImage: vine.string().trim().maxLength(255).optional()
  })
)

/**
 * Validateur pour l'ajout d'un véhicule à un conducteur
 */
export const addVehiculeValidator = vine.compile(
  vine.object({
    vehiculeId: vine.number().positive()
  })
)

/**
 * Validateur pour la recherche de conducteurs
 */
export const searchConducteurValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(2).maxLength(100)
  })
) 