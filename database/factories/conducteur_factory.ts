import factory from '@adonisjs/lucid/factories'
import Conducteur from '#models/Conducteur'

export const ConducteurFactory = factory
  .define(Conducteur, async ({ faker }) => {
    return {
      prenom:faker.person.firstName(),
      nom:faker.person.lastName(),
      adresse:faker.location.streetAddress({useFullAddress:true}),
      telephone:faker.phone.number({style:'national'}),
      frontCni:faker.image.personPortrait(),
      backCni:faker.image.avatar(),
      numCni:faker.string.ulid(),
      profilImage:faker.image.avatarGitHub()
    }
  })
  .build()