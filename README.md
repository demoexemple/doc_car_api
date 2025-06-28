# Doc Car API

API REST pour la gestion des documents automobiles avec authentification complète.

## 🚀 Fonctionnalités

- **Authentification complète** : Inscription, connexion, gestion des profils
- **Gestion des utilisateurs** : Rôles et permissions
- **Gestion des véhicules** : CRUD complet avec relations
- **Gestion des conducteurs** : Profils et permis de conduire
- **Documents automobiles** : Carte grise, assurance, vignette, visite technique, carte bleue
- **API REST** : Endpoints bien structurés avec validation
- **Tests** : Tests fonctionnels complets

## 🛠️ Technologies

- **AdonisJS 6** : Framework Node.js moderne
- **TypeScript** : Typage statique
- **Lucid ORM** : Gestion de base de données
- **VineJS** : Validation des données
- **JWT** : Authentification par tokens
- **MySQL** : Base de données
- **Japa** : Framework de tests

## 📋 Prérequis

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd doc_car_api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos paramètres de base de données :
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=doc_car_db
```

4. **Exécuter les migrations**
```bash
npm run migration:run
```

5. **Démarrer le serveur de développement**
```bash
npm run dev
```

Le serveur sera accessible sur `http://localhost:3333`

## 📚 Documentation API

La documentation complète de l'API est disponible dans le dossier `docs/` :

- [API d'Authentification](docs/auth_api.md)

## 🧪 Tests

### Exécuter tous les tests
```bash
npm test
```

### Exécuter les tests en mode watch
```bash
npm run test:watch
```

## 📁 Structure du Projet

```
doc_car_api/
├── app/
│   ├── controllers/     # Contrôleurs de l'application
│   ├── models/         # Modèles Lucid
│   ├── services/       # Services métier
│   ├── middleware/     # Middlewares personnalisés
│   └── validators/     # Validateurs VineJS
├── database/
│   ├── migrations/     # Migrations de base de données
│   └── factories/      # Factories pour les tests
├── start/
│   └── routes.ts       # Définition des routes
├── tests/              # Tests de l'application
└── docs/               # Documentation
```

## 🔐 Authentification

L'API utilise l'authentification JWT. Voici les endpoints principaux :

### Inscription
```bash
POST /auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Connexion
```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Profil utilisateur
```bash
GET /auth/profile
Authorization: Bearer <token>
```

## 🗄️ Base de Données

### Modèles principaux

- **User** : Utilisateurs avec rôles et hiérarchie
- **Vehicule** : Véhicules avec propriétaire
- **Conducteur** : Conducteurs avec permis
- **Documents** : Carte grise, assurance, vignette, etc.

### Relations

- User ↔ User (hiérarchie parent/enfant)
- User → Vehicule (propriétaire)
- Vehicule ↔ Conducteur (many-to-many)
- Vehicule → Documents (one-to-one)

## 🔧 Scripts Disponibles

- `npm run dev` : Serveur de développement avec hot reload
- `npm run build` : Build de production
- `npm run start` : Serveur de production
- `npm test` : Exécuter les tests
- `npm run migration:run` : Exécuter les migrations
- `npm run migration:rollback` : Annuler les migrations
- `npm run migration:fresh` : Réinitialiser la base de données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub. 