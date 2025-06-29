/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Routes publiques
router.get('/', async () => {
  return {
    message: 'API Doc Car - Bienvenue!',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      vehicules: '/vehicules',
      conducteurs: '/conducteurs',
      permis: '/permis-de-conduire'
    }
  }
})

// Importer les routes modulaires
import './routes/auth.js'
import './routes/vehicules.js'
import './routes/conducteurs.js'
import './routes/permis_de_conduire.js'
