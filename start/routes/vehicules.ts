import router from '@adonisjs/core/services/router'
import VehiculeController from '#controllers/vehicule_controller'
import { middleware } from '#start/kernel'

// Routes pour les véhicules
router.group(() => {
  // Créer un véhicule avec tous ses éléments
  router.post('/create', [VehiculeController, 'store'])
  
  // Récupérer tous les véhicules
  router.get('/', [VehiculeController, 'index'])
  
  // Récupérer un véhicule par ID avec tous ses éléments
  router.get('/:id', [VehiculeController, 'show']).where('id', router.matchers.number())
  
  // Mettre à jour un véhicule
  router.put('/:id', [VehiculeController, 'update']).where('id', router.matchers.number())
  
  // Supprimer un véhicule
  router.delete('/:id', [VehiculeController, 'destroy']).where('id', router.matchers.number())
  
  // Ajouter un conducteur à un véhicule
  router.post('/:id/conducteurs', [VehiculeController, 'addConducteur']).where('id', router.matchers.number())
  
  // Retirer un conducteur d'un véhicule
  router.delete('/:id/conducteurs/:conducteurId', [VehiculeController, 'removeConducteur'])
    .where('id', router.matchers.number())
    .where('conducteurId', router.matchers.number())
  
  // Récupérer les conducteurs d'un véhicule
  router.get('/:id/conducteurs', [VehiculeController, 'getConducteurs']).where('id', router.matchers.number())
  
  
  // Rechercher des véhicules
  router.get('/search', [VehiculeController, 'search'])
  
  // Statistiques des véhicules
  router.get('/stats', [VehiculeController, 'stats'])
  
  // Historique complet d'un véhicule
  router.get('/:id/historique', [VehiculeController, 'getHistorique']).where('id', router.matchers.number())
  
}).prefix('/vehicules').use(middleware.auth()) 