import router from '@adonisjs/core/services/router'
import PermisDeConduireController from '#controllers/permis_de_conduire_controller'
import { middleware } from '#start/kernel'

// Routes pour les permis de conduire
router.group(() => {
  // Créer un permis de conduire
  router.post('/create', [PermisDeConduireController, 'store'])
  
  // Récupérer tous les permis de conduire
  router.get('/', [PermisDeConduireController, 'index'])
  
  // Récupérer un permis de conduire par ID
  router.get('/:id', [PermisDeConduireController, 'show']).where('id',router.matchers.number())
  
  // Récupérer un permis de conduire par numéro
  router.get('/numero/:numero', [PermisDeConduireController, 'showByNumero'])
  
  // Récupérer le permis de conduire d'un conducteur
  // router.get('/conducteur/:conducteurId', [PermisDeConduireController, 'showByConducteur'])
  
  // Mettre à jour un permis de conduire
  router.put('/:id', [PermisDeConduireController, 'update'])
  
  // Supprimer un permis de conduire
  router.delete('/:id', [PermisDeConduireController, 'destroy'])
  
  // Vérifier si un permis est expiré
  router.get('/:id/expiration', [PermisDeConduireController, 'checkExpiration'])
  
  // Récupérer les permis expirés
  router.get('/expires', [PermisDeConduireController, 'getExpired'])
  
  // Récupérer les permis qui expirent bientôt
  router.get('/expirant', [PermisDeConduireController, 'getExpiringSoon'])
  
  // Rechercher des permis de conduire
  router.get('/search', [PermisDeConduireController, 'search'])
  
  // Statistiques des permis de conduire
  router.get('/stats', [PermisDeConduireController, 'stats'])
}).prefix('/permis-de-conduire').use(middleware.auth())