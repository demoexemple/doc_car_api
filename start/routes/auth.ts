import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'

// Routes d'authentification (publiques)
router.group(() => {
  // Inscription avec rate limiting>
  router.post('/register', [AuthController, 'register'])
  
  router.post('/login', [AuthController, 'login'])
  
  // router.post('/validate-token', [AuthController, 'validateToken'])
}).prefix('/auth')

// Routes protégées (nécessitent une authentification)
router.group(() => {
  router.get('/profile', [AuthController, 'profile'])
  
  router.put('/profile', [AuthController, 'update'])
  
  router.put('/change-password', [AuthController, 'changePassword'])
  
  // Déconnexion
  router.post('/logout', [AuthController, 'logout'])
  
  // Déconnexion de tous les appareils
  // router.post('/logout-all-devices', [AuthController, 'logoutAllDevices'])
  
  router.post('/refresh-token', [AuthController, 'refreshToken'])
}).prefix('/auth').use(middleware.auth())

// Routes d'administration (nécessitent le rôle admin)
router.group(() => {
  router.get('/users', [AuthController, 'getAllUsers'])
  
  router.delete('/users/:id', [AuthController, 'deleteUser'])
}).prefix('/admin').use([middleware.auth()/*,middleware.role(['admin'])*/])