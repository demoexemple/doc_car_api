# API d'Authentification - Doc Car

## Vue d'ensemble

Cette API fournit toutes les fonctionnalités d'authentification pour l'application Doc Car, incluant l'inscription, la connexion, la gestion des profils et l'administration des utilisateurs. **L'API est sécurisée contre les attaques par timing et les attaques par force brute.**

## 🔒 Sécurité

### Protections Implémentées

- **Protection contre les attaques par timing** : Vérification à temps constant des mots de passe
- **Rate Limiting** : Protection contre les attaques par force brute
- **Tokens JWT sécurisés** : Expiration automatique et invalidation
- **Validation stricte des mots de passe** : Politique de complexité
- **Messages d'erreur uniformes** : Évite la fuite d'informations

### Configuration de Sécurité

```typescript
// Rate Limiting
login: 5 tentatives / 15 minutes
register: 3 tentatives / heure
changePassword: 3 tentatives / heure

// Tokens
accessTokenExpiry: 24 heures
refreshTokenExpiry: 7 jours

// Politique de mots de passe
minLength: 8 caractères
requireUppercase: true
requireLowercase: true
requireNumbers: true
requireSpecialChars: true
```

## Base URL

```
http://localhost:3333
```

## Routes d'Authentification

### 1. Inscription d'un utilisateur

**POST** `/auth/register`

Crée un nouveau compte utilisateur avec validation sécurisée.

#### Corps de la requête
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "MotDePasse123!",
  "role": "user",
  "parent": 1
}
```

#### Paramètres
- `fullName` (optionnel) : Nom complet de l'utilisateur
- `email` (requis) : Adresse email unique
- `password` (requis) : Mot de passe sécurisé (voir politique ci-dessous)
- `role` (optionnel) : Rôle de l'utilisateur (`admin`, `user`, `manager`)
- `parent` (optionnel) : ID de l'utilisateur parent

#### Politique de mots de passe
- Minimum 8 caractères
- Au moins une lettre majuscule
- Au moins une lettre minuscule
- Au moins un chiffre
- Au moins un caractère spécial (@$!%*?&)
- Pas de mots de passe communs

#### Réponse de succès (201)
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "parent": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Connexion sécurisée

**POST** `/auth/login`

Authentifie un utilisateur avec protection contre les attaques par timing.

#### Corps de la requête
```json
{
  "email": "john@example.com",
  "password": "MotDePasse123!"
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "parent": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Validation de token

**POST** `/auth/validate-token`

Vérifie la validité d'un token d'accès.

#### Corps de la requête
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Token valide",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 4. Récupération du profil

**GET** `/auth/profile`

Récupère les informations du profil de l'utilisateur connecté.

#### Headers requis
```
Authorization: Bearer <token>
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "parent": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Mise à jour du profil

**PUT** `/auth/profile`

Met à jour les informations du profil utilisateur.

#### Headers requis
```
Authorization: Bearer <token>
```

#### Corps de la requête
```json
{
  "fullName": "John Smith",
  "email": "johnsmith@example.com",
  "role": "manager"
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "data": {
    "id": 1,
    "fullName": "John Smith",
    "email": "johnsmith@example.com",
    "role": "manager",
    "parent": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Changement de mot de passe sécurisé

**PUT** `/auth/change-password`

Change le mot de passe de l'utilisateur connecté avec invalidation des tokens.

#### Headers requis
```
Authorization: Bearer <token>
```

#### Corps de la requête
```json
{
  "currentPassword": "AncienMotDePasse123!",
  "newPassword": "NouveauMotDePasse456!"
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Mot de passe modifié avec succès. Vous devez vous reconnecter."
}
```

### 7. Déconnexion

**POST** `/auth/logout`

Déconnecte l'utilisateur en invalidant le token actuel.

#### Headers requis
```
Authorization: Bearer <token>
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

### 8. Déconnexion de tous les appareils

**POST** `/auth/logout-all-devices`

Déconnecte l'utilisateur de tous les appareils en invalidant tous les tokens.

#### Headers requis
```
Authorization: Bearer <token>
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Déconnexion de tous les appareils réussie"
}
```

### 9. Rafraîchir token

**POST** `/auth/refresh-token`

Rafraîchit le token d'accès actuel.

#### Headers requis
```
Authorization: Bearer <token>
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Token rafraîchi avec succès",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Routes d'Administration

### 1. Liste des utilisateurs

**GET** `/admin/users`

Récupère la liste de tous les utilisateurs (admin seulement).

#### Headers requis
```
Authorization: Bearer <token>
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "parent": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Suppression d'un utilisateur

**DELETE** `/admin/users/:id`

Supprime un utilisateur (admin seulement).

#### Headers requis
```
Authorization: Bearer <token>
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

## Codes d'Erreur

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Erreur de validation ou de données"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Accès refusé. Permissions insuffisantes."
}
```

### 429 - Too Many Requests
```json
{
  "success": false,
  "message": "Trop de tentatives. Réessayez dans 300 secondes.",
  "retryAfter": 300
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Erreur interne du serveur"
}
```

## Authentification

L'API utilise l'authentification par token Bearer. Incluez le token dans le header `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

## Rôles et Permissions

- **user** : Utilisateur standard
- **manager** : Gestionnaire avec permissions étendues
- **admin** : Administrateur avec toutes les permissions

## Validation des Données

Toutes les routes utilisent la validation VineJS pour s'assurer de l'intégrité des données :

- Email : Format email valide
- Mot de passe : Politique de complexité stricte
- Nom complet : Minimum 2 caractères
- Rôles : Valeurs autorisées uniquement

## 🔒 Mesures de Sécurité

### Protection contre les attaques par timing
- Vérification à temps constant des mots de passe
- Messages d'erreur uniformes
- Simulation de vérification même pour les utilisateurs inexistants

### Rate Limiting
- Connexion : 5 tentatives / 15 minutes
- Inscription : 3 tentatives / heure
- Changement de mot de passe : 3 tentatives / heure

### Gestion des tokens
- Expiration automatique après 24 heures
- Invalidation lors du changement de mot de passe
- Possibilité de déconnexion de tous les appareils

### Validation des mots de passe
- Complexité requise (majuscules, minuscules, chiffres, caractères spéciaux)
- Protection contre les mots de passe communs
- Longueur minimale et maximale 