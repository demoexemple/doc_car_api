import router from '@adonisjs/core/services/router'
import ConducteurController from '#controllers/conducteur_controller'
import { middleware } from '#start/kernel'

// Routes pour les conducteurs
router.group(() => {
  // Créer un conducteur
  router.post('/create', [ConducteurController, 'store'])
  
  // Récupérer tous les conducteurs
  router.get('/', [ConducteurController, 'index'])
  
  // Récupérer un conducteur par ID
  router.get('/:id', [ConducteurController, 'show'])
  
  // Mettre à jour un conducteur
  router.put('/:id', [ConducteurController, 'update'])
  
  // Supprimer un conducteur
  router.delete('/:id', [ConducteurController, 'destroy'])
  
  // Ajouter un véhicule à un conducteur
  router.post('/:id/vehicules', [ConducteurController, 'addVehicule'])
  
  // Retirer un véhicule d'un conducteur
  router.delete('/:id/vehicules/:vehiculeId', [ConducteurController, 'removeVehicule'])
  
  // Récupérer les véhicules d'un conducteur
  router.get('/:id/vehicules', [ConducteurController, 'getVehicules'])
  
  // Rechercher des conducteurs
  router.get('/search', [ConducteurController, 'search'])
  
  // Statistiques des conducteurs
  // router.get('/stats', [ConducteurController, 'stats'])
}).prefix('/conducteurs').use(middleware.auth()) 