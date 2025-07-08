# API Conducteurs - Doc Car

## Vue d'ensemble

Cette API gère les conducteurs de l'application Doc Car, incluant leurs informations personnelles, leurs véhicules associés et leurs permis de conduire.

## Base URL

```
http://localhost:3333
```

## Routes des Conducteurs

### 1. Créer un conducteur

**POST** `/conducteurs/create`

Crée un nouveau conducteur.

#### Corps de la requête
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "adresse": "123 Rue de la Paix, Paris",
  "telephone": "+33123456789",
  "numCni": "1234567890123456",
  "frontCni": "path/to/front.jpg",
  "backCni": "path/to/back.jpg",
  "profilImage": "path/to/profile.jpg"
}
```

#### Paramètres
- `prenom` (requis) : Prénom du conducteur
- `nom` (requis) : Nom du conducteur
- `adresse` (optionnel) : Adresse du conducteur
- `telephone` (requis) : Numéro de téléphone unique
- `numCni` (requis) : Numéro de carte nationale d'identité unique
- `frontCni` (optionnel) : Chemin vers l'image recto de la CNI
- `backCni` (optionnel) : Chemin vers l'image verso de la CNI
- `profilImage` (optionnel) : Chemin vers l'image de profil

#### Réponse de succès (201)
```json
{
  "success": true,
  "message": "Conducteur créé avec succès",
  "data": {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "adresse": "123 Rue de la Paix, Paris",
    "telephone": "+33123456789",
    "numCni": "1234567890123456",
    "frontCni": "path/to/front.jpg",
    "backCni": "path/to/back.jpg",
    "profilImage": "path/to/profile.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "vehicules": [],
    "permisDeConduire": []
  }
}
```

### 2. Récupérer tous les conducteurs

**GET** `/conducteurs`

Récupère la liste paginée des conducteurs.

#### Paramètres de requête
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
- `search` (optionnel) : Terme de recherche

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "meta": {
      "total": 50,
      "per_page": 10,
      "current_page": 1,
      "last_page": 5
    },
    "data": [
      {
        "id": 1,
        "prenom": "Jean",
        "nom": "Dupont",
        "telephone": "+33123456789",
        "numCni": "1234567890123456",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 3. Récupérer un conducteur par ID

**GET** `/conducteurs/:id`

Récupère les détails d'un conducteur spécifique.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "adresse": "123 Rue de la Paix, Paris",
    "telephone": "+33123456789",
    "numCni": "1234567890123456",
    "frontCni": "path/to/front.jpg",
    "backCni": "path/to/back.jpg",
    "profilImage": "path/to/profile.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "vehicules": [
      {
        "id": 1,
        "marque": "Renault",
        "modele": "Clio",
        "type": "Citadine"
      }
    ],
    "permisDeConduire": [
      {
        "id": 1,
        "numero": "123456789",
        "categorie": "B",
        "dateExpiration": "2025-12-31"
      }
    ]
  }
}
```

### 4. Mettre à jour un conducteur

**PUT** `/conducteurs/:id`

Met à jour les informations d'un conducteur.

#### Corps de la requête
```json
{
  "prenom": "Jean-Pierre",
  "adresse": "456 Avenue des Champs, Lyon",
  "telephone": "+33987654321"
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Conducteur mis à jour avec succès",
  "data": {
    "id": 1,
    "prenom": "Jean-Pierre",
    "nom": "Dupont",
    "adresse": "456 Avenue des Champs, Lyon",
    "telephone": "+33987654321",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Supprimer un conducteur

**DELETE** `/conducteurs/:id`

Supprime un conducteur et ses associations.

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Conducteur supprimé avec succès"
}
```

### 6. Ajouter un véhicule à un conducteur

**POST** `/conducteurs/:id/vehicules`

Associe un véhicule à un conducteur.

#### Corps de la requête
```json
{
  "vehiculeId": 1
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Véhicule ajouté au conducteur avec succès",
  "data": {
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "vehicules": [
      {
        "id": 1,
        "marque": "Renault",
        "modele": "Clio"
      }
    ]
  }
}
```

### 7. Retirer un véhicule d'un conducteur

**DELETE** `/conducteurs/:id/vehicules/:vehiculeId`

Retire l'association entre un conducteur et un véhicule.

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Véhicule retiré du conducteur avec succès"
}
```

### 8. Récupérer les véhicules d'un conducteur

**GET** `/conducteurs/:id/vehicules`

Récupère tous les véhicules associés à un conducteur.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "marque": "Renault",
      "modele": "Clio",
      "type": "Citadine",
      "usages": "Personnel"
    }
  ]
}
```

### 9. Rechercher des conducteurs

**GET** `/conducteurs/search?q=jean`

Recherche des conducteurs par nom, prénom, numéro CNI ou téléphone.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont",
      "telephone": "+33123456789",
      "numCni": "1234567890123456"
    }
  ]
}
```

### 10. Statistiques des conducteurs

**GET** `/conducteurs/stats`

Récupère les statistiques des conducteurs.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "total": 50,
    "avecPermis": 45,
    "sansPermis": 5
  }
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

### 404 - Not Found
```json
{
  "success": false,
  "message": "Conducteur non trouvé"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "Un conducteur avec ce numéro CNI existe déjà"
}
```

## Authentification

Toutes les routes nécessitent une authentification. Incluez le token dans le header :

```
Authorization: Bearer <votre_token_jwt>
```

## Validation des Données

- **Prénom/Nom** : 2-100 caractères
- **Téléphone** : 8-20 caractères
- **Numéro CNI** : 5-50 caractères, unique
- **Adresse** : Maximum 255 caractères
- **Images** : Chemins de fichiers, maximum 255 caractères 