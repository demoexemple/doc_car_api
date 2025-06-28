/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import './routes/auth.js'

// Routes publiques
router.get('/', async () => {
  return {
    message: 'API Doc Car - Bienvenue!',
    version: '1.0.0'
  }
})
