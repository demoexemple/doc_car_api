// import { test } from '@japa/runner'
// import { UserFactory } from '#factories/user_factory'

// test.group('Auth API', (group) => {
//   group.each.setup(async () => {
//     // Nettoyer la base de données avant chaque test
//     await UserFactory.query().delete()
//   })

//   test('should register a new user', async ({ client }) => {
//     const userData = {
//       fullName: 'John Doe',
//       email: 'john@example.com',
//       password: 'password123',
//       role: 'user'
//     }

//     const response = await client.post('/auth/register').json(userData)

//     response.assertStatus(201)
//     response.assertBodyContains({
//       success: true,
//       message: 'Utilisateur créé avec succès'
//     })
//     response.assertBodyContains({
//       data: {
//         fullName: 'John Doe',
//         email: 'john@example.com',
//         role: 'user'
//       }
//     })
//   })

//   test('should not register user with existing email', async ({ client }) => {
//     // Créer un utilisateur existant
//     await UserFactory.create({ email: 'john@example.com' })

//     const userData = {
//       fullName: 'John Doe',
//       email: 'john@example.com',
//       password: 'password123',
//       role: 'user'
//     }

//     const response = await client.post('/auth/register').json(userData)

//     response.assertStatus(400)
//     response.assertBodyContains({
//       success: false,
//       message: 'Un utilisateur avec cet email existe déjà'
//     })
//   })

//   test('should login user with valid credentials', async ({ client }) => {
//     // Créer un utilisateur
//     const user = await UserFactory.create({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     const loginData = {
//       email: 'john@example.com',
//       password: 'password123'
//     }

//     const response = await client.post('/auth/login').json(loginData)

//     response.assertStatus(200)
//     response.assertBodyContains({
//       success: true,
//       message: 'Connexion réussie'
//     })
//     response.assertBodyContains({
//       data: {
//         user: {
//           email: 'john@example.com'
//         },
//         token: response.body().data.token
//       }
//     })
//   })

//   test('should not login with invalid credentials', async ({ client }) => {
//     const loginData = {
//       email: 'john@example.com',
//       password: 'wrongpassword'
//     }

//     const response = await client.post('/auth/login').json(loginData)

//     response.assertStatus(401)
//     response.assertBodyContains({
//       success: false,
//       message: 'Email ou mot de passe incorrect'
//     })
//   })

//   test('should get user profile when authenticated', async ({ client }) => {
//     const user = await UserFactory.create({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     // Se connecter pour obtenir un token
//     const loginResponse = await client.post('/auth/login').json({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     const token = loginResponse.body().data.token

//     const response = await client.get('/auth/profile').header('Authorization', `Bearer ${token}`)

//     response.assertStatus(200)
//     response.assertBodyContains({
//       success: true,
//       data: {
//         email: 'john@example.com'
//       }
//     })
//   })

//   test('should not get profile without authentication', async ({ client }) => {
//     const response = await client.get('/auth/profile')

//     response.assertStatus(401)
//     response.assertBodyContains({
//       success: false,
//       message: 'Token d\'authentification invalide ou manquant'
//     })
//   })

//   test('should update user profile when authenticated', async ({ client }) => {
//     const user = await UserFactory.create({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     // Se connecter pour obtenir un token
//     const loginResponse = await client.post('/auth/login').json({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     const token = loginResponse.body().data.token

//     const updateData = {
//       fullName: 'John Smith',
//       email: 'johnsmith@example.com'
//     }

//     const response = await client.put('/auth/profile')
//       .header('Authorization', `Bearer ${token}`)
//       .json(updateData)

//     response.assertStatus(200)
//     response.assertBodyContains({
//       success: true,
//       message: 'Profil mis à jour avec succès'
//     })
//     response.assertBodyContains({
//       data: {
//         fullName: 'John Smith',
//         email: 'johnsmith@example.com'
//       }
//     })
//   })

//   test('should change password when authenticated', async ({ client }) => {
//     const user = await UserFactory.create({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     // Se connecter pour obtenir un token
//     const loginResponse = await client.post('/auth/login').json({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     const token = loginResponse.body().data.token

//     const passwordData = {
//       currentPassword: 'password123',
//       newPassword: 'newpassword123'
//     }

//     const response = await client.put('/auth/change-password')
//       .header('Authorization', `Bearer ${token}`)
//       .json(passwordData)

//     response.assertStatus(200)
//     response.assertBodyContains({
//       success: true,
//       message: 'Mot de passe modifié avec succès'
//     })
//   })

//   test('should logout user', async ({ client }) => {
//     const user = await UserFactory.create({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     // Se connecter pour obtenir un token
//     const loginResponse = await client.post('/auth/login').json({
//       email: 'john@example.com',
//       password: 'password123'
//     })

//     const token = loginResponse.body().data.token

//     const response = await client.post('/auth/logout')
//       .header('Authorization', `Bearer ${token}`)

//     response.assertStatus(200)
//     response.assertBodyContains({
//       success: true,
//       message: 'Déconnexion réussie'
//     })
//   })
// }) 