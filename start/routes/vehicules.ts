import router from '@adonisjs/core/services/router'

// Routes pour les véhicules
router.group(() => {
  // Créer un véhicule
  router.post('/create', ['#controllers/vehicule_controller', 'store'])
  
  // Récupérer tous les véhicules
  router.get('/', ['#controllers/vehicule_controller', 'index'])
  
  // Récupérer un véhicule par ID
  router.get('/:id', ['#controllers/vehicule_controller', 'show'])
  
  // Mettre à jour un véhicule
  router.put('/:id', ['#controllers/vehicule_controller', 'update'])
  
  // Supprimer un véhicule
  router.delete('/:id', ['#controllers/vehicule_controller', 'destroy'])
  
  // Ajouter un conducteur à un véhicule
  router.post('/:id/conducteurs', ['#controllers/vehicule_controller', 'addConducteur'])
  
  // Retirer un conducteur d'un véhicule
  router.delete('/:id/conducteurs/:conducteurId', ['#controllers/vehicule_controller', 'removeConducteur'])
  
  // Récupérer les conducteurs d'un véhicule
  router.get('/:id/conducteurs', ['#controllers/vehicule_controller', 'getConducteurs'])
  
  // Récupérer les documents d'un véhicule
  router.get('/:id/documents', ['#controllers/vehicule_controller', 'getDocuments'])
  
  // Rechercher des véhicules
  router.get('/search', ['#controllers/vehicule_controller', 'search'])
  
  // Statistiques des véhicules
  router.get('/stats', ['#controllers/vehicule_controller', 'stats'])
}).prefix('/vehicules').middleware('auth') 