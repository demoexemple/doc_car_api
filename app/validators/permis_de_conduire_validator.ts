import vine from '@vinejs/vine'

/**
 * Validateur pour la création d'un permis de conduire
 */
export const createPermisValidator = vine.compile(
  vine.object({
    numero: vine.string().trim().minLength(5).maxLength(50),
    categorie: vine.string().trim().minLength(1).maxLength(10),
    dateDelivrance: vine.date(),
    dateExpiration: vine.date(),
    documentPdf: vine.string().trim().maxLength(255).optional(),
    conducteurId: vine.number().positive()
  })
)

/**
 * Validateur pour la mise à jour d'un permis de conduire
 */
export const updatePermisValidator = vine.compile(
  vine.object({
    numero: vine.string().trim().minLength(5).maxLength(50).optional(),
    categorie: vine.string().trim().minLength(1).maxLength(10).optional(),
    dateDelivrance: vine.date().optional(),
    dateExpiration: vine.date().optional(),
    documentPdf: vine.string().trim().maxLength(255).optional()
  })
)

/**
 * Validateur pour la recherche de permis de conduire
 */
export const searchPermisValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(2).maxLength(100)
  })
)

/**
 * Validateur pour les filtres de permis de conduire
 */
export const filterPermisValidator = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    limit: vine.number().positive().max(100).optional(),
    search: vine.string().trim().maxLength(100).optional(),
    expired: vine.boolean().optional()
  })
) 