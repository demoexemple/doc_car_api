# API Permis de Conduire - Doc Car

## Vue d'ensemble

Cette API gère les permis de conduire des conducteurs dans l'application Doc Car, incluant la validation des dates d'expiration et la gestion des catégories.

## Base URL

```
http://localhost:3333
```

## Routes des Permis de Conduire

### 1. Créer un permis de conduire

**POST** `/permis-de-conduire/create`

Crée un nouveau permis de conduire pour un conducteur.

#### Corps de la requête
```json
{
  "numero": "123456789",
  "categorie": "B",
  "dateDelivrance": "2020-01-15",
  "dateExpiration": "2030-01-15",
  "documentPdf": "path/to/permis.pdf",
  "conducteurId": 1
}
```

#### Paramètres
- `numero` (requis) : Numéro unique du permis de conduire
- `categorie` (requis) : Catégorie du permis (A, B, C, D, E, etc.)
- `dateDelivrance` (requis) : Date de délivrance du permis
- `dateExpiration` (requis) : Date d'expiration du permis
- `documentPdf` (optionnel) : Chemin vers le document PDF du permis
- `conducteurId` (requis) : ID du conducteur propriétaire

#### Réponse de succès (201)
```json
{
  "success": true,
  "message": "Permis de conduire créé avec succès",
  "data": {
    "id": 1,
    "numero": "123456789",
    "categorie": "B",
    "dateDelivrance": "2020-01-15T00:00:00.000Z",
    "dateExpiration": "2030-01-15T00:00:00.000Z",
    "documentPdf": "path/to/permis.pdf",
    "conducteurId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "conducteur": {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont"
    }
  }
}
```

### 2. Récupérer tous les permis de conduire

**GET** `/permis-de-conduire`

Récupère la liste paginée des permis de conduire.

#### Paramètres de requête
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
- `search` (optionnel) : Terme de recherche
- `expired` (optionnel) : Filtrer par statut d'expiration (true/false)

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "meta": {
      "total": 25,
      "per_page": 10,
      "current_page": 1,
      "last_page": 3
    },
    "data": [
      {
        "id": 1,
        "numero": "123456789",
        "categorie": "B",
        "dateExpiration": "2030-01-15T00:00:00.000Z",
        "conducteur": {
          "id": 1,
          "prenom": "Jean",
          "nom": "Dupont"
        }
      }
    ]
  }
}
```

### 3. Récupérer un permis de conduire par ID

**GET** `/permis-de-conduire/:id`

Récupère les détails d'un permis de conduire spécifique.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero": "123456789",
    "categorie": "B",
    "dateDelivrance": "2020-01-15T00:00:00.000Z",
    "dateExpiration": "2030-01-15T00:00:00.000Z",
    "documentPdf": "path/to/permis.pdf",
    "conducteurId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "conducteur": {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont",
      "telephone": "+33123456789"
    }
  }
}
```

### 4. Récupérer un permis de conduire par numéro

**GET** `/permis-de-conduire/numero/:numero`

Récupère un permis de conduire par son numéro.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero": "123456789",
    "categorie": "B",
    "dateExpiration": "2030-01-15T00:00:00.000Z",
    "conducteur": {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont"
    }
  }
}
```

### 5. Récupérer le permis de conduire d'un conducteur

**GET** `/permis-de-conduire/conducteur/:conducteurId`

Récupère le permis de conduire d'un conducteur spécifique.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero": "123456789",
    "categorie": "B",
    "dateDelivrance": "2020-01-15T00:00:00.000Z",
    "dateExpiration": "2030-01-15T00:00:00.000Z",
    "conducteur": {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont"
    }
  }
}
```

### 6. Mettre à jour un permis de conduire

**PUT** `/permis-de-conduire/:id`

Met à jour les informations d'un permis de conduire.

#### Corps de la requête
```json
{
  "categorie": "B+E",
  "dateExpiration": "2035-01-15",
  "documentPdf": "path/to/new_permis.pdf"
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Permis de conduire mis à jour avec succès",
  "data": {
    "id": 1,
    "numero": "123456789",
    "categorie": "B+E",
    "dateExpiration": "2035-01-15T00:00:00.000Z",
    "documentPdf": "path/to/new_permis.pdf",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Supprimer un permis de conduire

**DELETE** `/permis-de-conduire/:id`

Supprime un permis de conduire.

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Permis de conduire supprimé avec succès"
}
```

### 8. Vérifier si un permis est expiré

**GET** `/permis-de-conduire/:id/expiration`

Vérifie si un permis de conduire est expiré.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "isExpired": false
  }
}
```

### 9. Récupérer les permis expirés

**GET** `/permis-de-conduire/expires`

Récupère tous les permis de conduire expirés.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "numero": "987654321",
      "categorie": "A",
      "dateExpiration": "2023-12-31T00:00:00.000Z",
      "conducteur": {
        "id": 2,
        "prenom": "Marie",
        "nom": "Martin"
      }
    }
  ]
}
```

### 10. Récupérer les permis qui expirent bientôt

**GET** `/permis-de-conduire/expirant`

Récupère les permis de conduire qui expirent dans les 30 prochains jours.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "numero": "555666777",
      "categorie": "C",
      "dateExpiration": "2024-01-25T00:00:00.000Z",
      "conducteur": {
        "id": 3,
        "prenom": "Pierre",
        "nom": "Durand"
      }
    }
  ]
}
```

### 11. Rechercher des permis de conduire

**GET** `/permis-de-conduire/search?q=123456`

Recherche des permis de conduire par numéro, catégorie ou nom du conducteur.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero": "123456789",
      "categorie": "B",
      "conducteur": {
        "id": 1,
        "prenom": "Jean",
        "nom": "Dupont"
      }
    }
  ]
}
```

### 12. Statistiques des permis de conduire

**GET** `/permis-de-conduire/stats`

Récupère les statistiques des permis de conduire.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "total": 25,
    "valides": 20,
    "expires": 3,
    "expirant": 2
  }
}
```

## Codes d'Erreur

### 400 - Bad Request
```json
{
  "success": false,
  "message": "La date d'expiration doit être postérieure à la date de délivrance"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Permis de conduire non trouvé"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "Un permis de conduire avec ce numéro existe déjà"
}
```

## Authentification

Toutes les routes nécessitent une authentification. Incluez le token dans le header :

```
Authorization: Bearer <votre_token_jwt>
```

## Validation des Données

- **Numéro** : 5-50 caractères, unique
- **Catégorie** : 1-10 caractères (A, B, C, D, E, etc.)
- **Date de délivrance** : Date valide
- **Date d'expiration** : Date valide, postérieure à la date de délivrance
- **Document PDF** : Chemin de fichier, maximum 255 caractères
- **Conducteur ID** : ID valide d'un conducteur existant

## Règles Métier

1. **Unicité** : Un conducteur ne peut avoir qu'un seul permis de conduire
2. **Dates** : La date d'expiration doit toujours être postérieure à la date de délivrance
3. **Numéro unique** : Chaque numéro de permis doit être unique dans le système
4. **Expiration** : Un permis est considéré comme expiré si la date d'expiration est passée
5. **Expiration proche** : Un permis expire "bientôt" s'il expire dans les 30 prochains jours 