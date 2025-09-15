/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'

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
import Vehicule from '#models/Vehicule'
import Conducteur from '#models/Conducteur'
import User from '#models/user'
import { messages } from '@vinejs/vine/defaults'


router.get('/stats',async({response}:HttpContext )=>{

  try {
    
    const vehicules=await Vehicule.query().select(['id','voler'])
  const conducteurs =await Conducteur.query().select('id')

  const users=await User.query().select('id')

  const vehiculeVoler=[]

  for (const v of vehicules) {
    if(v.voler){
      vehiculeVoler.push(v)
    }
  }

   return response.status(200).json({
        data:{
          vehicules:vehicules.length,
          users:users.length,
          conducteurs:conducteurs.length
        },
        success: true,
        message: 'Conducteur supprimé avec succès'
      })

  } catch (error) {
     return response.status(400).json({
        success: false,
        message: error.message || 'Erreur lors de la recuperation des statistiques du system'
      })
  }

  

  

})

// router.get("/",async({response}:HttpContext )=>{
//   response.send({message:"Ok , demo"})
// })

router.get("/demo",async({response}:HttpContext )=>{
  return response.json( [
    {
      id:"1",
      name:"demo"
    }
  ])
})
