import { Database } from '@adonisjs/lucid/database'
import vine from '@vinejs/vine'

/**
 * Validateur pour la création d'un véhicule
 */
export const createVehiculeValidator = vine.compile(
  vine.object({
    marque: vine.string().trim().minLength(2).maxLength(100),
    modele: vine.string().trim().minLength(2).maxLength(100),
    type: vine.string().trim().minLength(2).maxLength(50),
    usages: vine.string().trim().maxLength(100).optional(),
    proprietaireId: vine.number().positive(),
    voler:vine.boolean().optional()
  })
)

export const createVehiculeWithAllValidator = vine.compile(
  vine.object({
    marque: vine.string().trim().minLength(2).maxLength(100),
    modele: vine.string().trim().minLength(2).maxLength(100),
    type: vine.string().trim().minLength(2).maxLength(50),
    usages: vine.string().trim().maxLength(100).optional(),
    proprietaireId: vine.number().positive(),
    carteGrise: vine.object({
      numero: vine
        .string()
        .trim()
        .minLength(5)
        .maxLength(50)
        .unique(async (db: Database, value: string) => {
          const result = await db.from('carte_grises').select('id').where('numero', value)
          return result.length ? false : true
        }),
      immatriculation: vine
        .string()
        .trim()
        .minLength(5)
        .maxLength(20)
        .unique(async (db: Database, value: string) => {
          const result = await db.from('carte_grises').select('id').where('immatriculation', value)
          return result.length ? false : true
        }),
      dateDelivrance: vine.date(),
      dateExpiration: vine.date(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }),
    assurance: vine.object({
      numeroContrat: vine
        .string()
        .trim()
        .minLength(5)
        .maxLength(50)
        .unique(async (db: Database, value: string) => {
          const result = await db.from('assurances').select('id').where('numero_contrat', value)
          return result.length ? false : true
        }),
      companie: vine.string().trim().minLength(2).maxLength(100),
      dateDebut: vine.date(),
      dateExpiration: vine.date(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }),
    vignette: vine.object({
      dateDelivrance: vine.date(),
      dateExpiration: vine.date(),
      montant: vine.number().positive(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }),
    visiteTechnique: vine.object({
      centre: vine.string().trim().minLength(2).maxLength(100),
      dateDernierControle: vine.date(),
      dateExpirationControle: vine.date(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }),
    carteBleue: vine.object({
      numero: vine
        .string()
        .trim()
        .minLength(5)
        .maxLength(50)
        .unique(async (db: Database, value: string) => {
          const result = await db.from('carte_bleues').select('id').where('numero', value)
          return result.length ? false : true
        }),
      type: vine.string().trim().minLength(2).maxLength(100),
      dateDelivrance: vine.date(),
      dateExpiration: vine.date(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }).optional(),
  })
)

/**
 * Validateur pour la mise à jour d'un véhicule
 */
export const updateVehiculeValidator = vine.compile(
  vine.object({
    marque: vine.string().trim().minLength(2).maxLength(100).optional(),
    modele: vine.string().trim().minLength(2).maxLength(100).optional(),
    type: vine.string().trim().minLength(2).maxLength(50).optional(),
    usages: vine.string().trim().maxLength(100).optional(),
    proprietaireId: vine.number().positive().optional(),
    voler:vine.boolean().optional()

  })
)

export const updateVehiculeWithRelationsValidator = vine.compile(
  vine.object({
    marque: vine.string().trim().minLength(2).maxLength(100).optional(),
    modele: vine.string().trim().minLength(2).maxLength(100).optional(),
    type: vine.string().trim().minLength(2).maxLength(50).optional(),
    usages: vine.string().trim().maxLength(100).optional(),
    proprietaireId: vine.number().positive().optional(),
    voler:vine.boolean().optional(),
    carteGrise: vine.object({
      id: vine.number().positive().optional(),
      numero: vine.string().trim().minLength(5).maxLength(50).optional(),
      immatriculation: vine.string().trim().minLength(5).maxLength(20).optional(),
      dateDelivrance: vine.date().optional(),
      dateExpiration: vine.date().optional(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }).optional(),
    assurance: vine.object({
      id: vine.number().positive().optional(),
      numeroContrat: vine.string().trim().minLength(5).maxLength(50).optional(),
      companie: vine.string().trim().minLength(2).maxLength(100).optional(),
      dateDebut: vine.date().optional(),
      dateExpiration: vine.date().optional(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }).optional(),
    vignette: vine.object({
      id: vine.number().positive().optional(),
      dateDelivrance: vine.date().optional(),
      dateExpiration: vine.date().optional(),
      montant: vine.number().positive().optional(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }).optional(),
    visiteTechnique: vine.object({
      id: vine.number().positive().optional(),
      centre: vine.string().trim().minLength(2).maxLength(100).optional(),
      dateDernierControle: vine.date().optional(),
      dateExpirationControle: vine.date().optional(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }).optional(),
    carteBleue: vine.object({
      id: vine.number().positive().optional(),
      numero: vine.string().trim().minLength(5).maxLength(50).optional(),
      type: vine.enum(['Essence', 'Diesel', 'Électrique', 'Hybride']).optional(),
      dateDelivrance: vine.date().optional(),
      dateExpiration: vine.date().optional(),
      documentPdf: vine.string().trim().maxLength(255).optional(),
    }).optional(),
  })
)

/**
 * Validateur pour l'ajout d'un conducteur à un véhicule
 */
export const addConducteurValidator = vine.compile(
  vine.object({
    conducteurId: vine.number().positive(),
  })
)

/**
 * Validateur pour la recherche de véhicules
 */
export const searchVehiculeValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(2).maxLength(100),
  })
)

/**
 * Validateur pour la carte grise
 */
export const carteGriseValidator = vine.compile(
  vine.object({
    numero: vine.string().trim().minLength(5).maxLength(50),
    immatriculation: vine.string().trim().minLength(5).maxLength(20).optional(),
    dateDelivrance: vine.date(),
    dateExpiration: vine.date(),
    documentPdf: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Validateur pour l'assurance
 */
export const assuranceValidator = vine.compile(
  vine.object({
    numeroContrat: vine.string().trim().minLength(5).maxLength(50),
    companie: vine.string().trim().minLength(2).maxLength(100),
    dateDebut: vine.date(),
    dateExpiration: vine.date(),
    documentPdf: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Validateur pour la vignette
 */
export const vignetteValidator = vine.compile(
  vine.object({
    dateDelivrance: vine.date(),
    dateExpiration: vine.date(),
    montant: vine.number().positive(),
    documentPdf: vine.string().trim().maxLength(255).optional(),
  })
)
// companie|compagnie
/**
 * Validateur pour la visite technique
 */
export const visiteTechniqueValidator = vine.compile(
  vine.object({
    centre: vine.string().trim().minLength(2).maxLength(100),
    dateDernierControle: vine.date(),
    dateExpirationControle: vine.date(),
    documentPdf: vine.string().trim().maxLength(255).optional(),
  })
)

/**
 * Validateur pour la carte bleue
 */
export const carteBleueValidator = vine.compile(
  vine.object({
    numero: vine.string().trim().minLength(5).maxLength(50),
    type: vine.enum(['Essence', 'Diesel', 'Électrique', 'Hybride']),
    dateDelivrance: vine.date(),
    dateExpiration: vine.date(),
    documentPdf: vine.string().trim().maxLength(255).optional(),
  })
)
