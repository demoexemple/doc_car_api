import router from '@adonisjs/core/services/router'
import VehiculeController from '#controllers/vehicule_controller'
import { middleware } from '#start/kernel'

// Routes pour les véhicules
router.group(() => {
  router.post('/create', [VehiculeController, 'store'])
  
  router.get('/', [VehiculeController, 'index'])
  
  router.get('/:id', [VehiculeController, 'show']).where('id', router.matchers.number())
  
  router.put('/:id', [VehiculeController, 'update']).where('id', router.matchers.number())
  
  router.delete('/:id', [VehiculeController, 'destroy']).where('id', router.matchers.number())
  
  router.post('/:id/conducteurs', [VehiculeController, 'addConducteur']).where('id', router.matchers.number())
  
  router.delete('/:id/conducteurs/:conducteurId', [VehiculeController, 'removeConducteur'])
    .where('id', router.matchers.number())
    .where('conducteurId', router.matchers.number())
  
  router.get('/:id/conducteurs', [VehiculeController, 'getConducteurs']).where('id', router.matchers.number())
  
  
  router.get('/search', [VehiculeController, 'search'])
  
  router.get('/stats', [VehiculeController, 'stats'])
  
  router.get('/:id/historique', [VehiculeController, 'getHistorique']).where('id', router.matchers.number())
  
}).prefix('/vehicules').use(middleware.auth()) 