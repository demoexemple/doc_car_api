import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'

// Routes d'authentification (publiques)
router.group(() => {
  // Inscription avec rate limiting
  router.post('/register', [AuthController, 'register'])
  
  // Connexion avec rate limiting strict
  router.post('/login', [AuthController, 'login'])
  
  // Validation de token (publique)
  // router.post('/validate-token', [AuthController, 'validateToken'])
}).prefix('/auth')

// Routes protégées (nécessitent une authentification)
router.group(() => {
  // Profil utilisateur
  router.get('/profile', [AuthController, 'profile'])
  
  // Mise à jour du profil
  router.put('/profile', [AuthController, 'update'])
  
  // Changement de mot de passe avec rate limiting
  router.put('/change-password', [AuthController, 'changePassword'])
  
  // Déconnexion
  router.post('/logout', [AuthController, 'logout'])
  
  // Déconnexion de tous les appareils
  // router.post('/logout-all-devices', [AuthController, 'logoutAllDevices'])
  
  // Rafraîchir token
  router.post('/refresh-token', [AuthController, 'refreshToken'])
}).prefix('/auth').use(middleware.auth())

// Routes d'administration (nécessitent le rôle admin)
router.group(() => {
  // Récupérer tous les utilisateurs
  router.get('/users', [AuthController, 'getAllUsers'])
  
  // Supprimer un utilisateur
  router.delete('/users/:id', [AuthController, 'deleteUser'])
}).prefix('/admin').use([middleware.auth,middleware.role(['admin'])])