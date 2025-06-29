# API Véhicules - Doc Car

## Vue d'ensemble

Cette API gère les véhicules de l'application Doc Car avec tous leurs éléments associés : carte grise, assurance, vignette, visite technique et carte bleue. Elle permet de créer un véhicule complet en une seule requête.

## Base URL

```
http://localhost:3333
```

## Routes des Véhicules

### 1. Créer un véhicule avec tous ses éléments

**POST** `/vehicules/create`

Crée un nouveau véhicule avec tous ses documents associés en une seule requête.

#### Corps de la requête
```json
{
  "marque": "Renault",
  "modele": "Clio",
  "type": "Citadine",
  "usages": "Personnel",
  "proprietaireId": 4,
  "carteGrise": {
    "numero": "CG123456789",
    "dateDelivrance": "2020-01-15",
    "dateExpiration": "2030-01-15",
    "documentPdf": "path/to/carte_grise.pdf",
    "immatriculation": "AB-123-CD"
  },
  "assurance": {
    "numeroContrat": "ASS123456789",
    "companie": "AXA",
    "dateDebut": "2024-01-01",
    "dateExpiration": "2025-01-01",
    "documentPdf": "path/to/assurance.pdf"
  },
  "vignette": {
    "dateDelivrance": "2024-01-01",
    "dateExpiration": "2024-12-31",
    "montant": 150.00,
    "documentPdf": "path/to/vignette.pdf"
  },
  "visiteTechnique": {
    "centre": "Centre Technique Auto",
    "dateDernierControle": "2024-01-15",
    "dateExpirationControle": "2025-01-15",
    "documentPdf": "path/to/visite_technique.pdf"
  },
  "carteBleue": {
    "numero": "CB123456789",
    "type": "Essence",
    "dateDelivrance": "2024-01-01",
    "dateExpiration": "2024-12-31",
    "documentPdf": "path/to/carte_bleue.pdf"
  }
}
```

#### Paramètres du véhicule
- `marque` (requis) : Marque du véhicule
- `modele` (requis) : Modèle du véhicule
- `type` (requis) : Type de véhicule (Citadine, SUV, etc.)
- `usages` (optionnel) : Usage du véhicule (Personnel, Professionnel, etc.)
- `immatriculation` (requis) : Numéro d'immatriculation unique
- `annee` (requis) : Année de fabrication
- `couleur` (optionnel) : Couleur du véhicule
- `proprietaireId` (requis) : ID du propriétaire (utilisateur)

#### Paramètres des éléments associés (tous optionnels)
- `carteGrise` : Données de la carte grise
- `assurance` : Données de l'assurance
- `vignette` : Données de la vignette
- `visiteTechnique` : Données de la visite technique
- `carteBleue` : Données de la carte bleue

#### Réponse de succès (201)
```json
{
  "success": true,
  "message": "Véhicule créé avec succès",
  "data": {
    "vehicule": {
      "id": 1,
      "marque": "Renault",
      "modele": "Clio",
      "type": "Citadine",
      "immatriculation": "AB-123-CD",
      "annee": 2020,
      "couleur": "Blanc",
      "proprietaireId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "carteGrise": {
      "id": 1,
      "numero": "CG123456789",
      "dateExpiration": "2030-01-15T00:00:00.000Z"
    },
    "assurance": {
      "id": 1,
      "numero": "ASS123456789",
      "compagnie": "AXA",
      "dateFin": "2025-01-01T00:00:00.000Z"
    },
    "vignette": {
      "id": 1,
      "numero": "VIG123456789",
      "dateExpiration": "2024-12-31T00:00:00.000Z"
    },
    "visiteTechnique": {
      "id": 1,
      "numero": "VT123456789",
      "resultat": "Favorable",
      "dateExpiration": "2025-01-15T00:00:00.000Z"
    },
    "carteBleue": {
      "id": 1,
      "numero": "CB123456789",
      "type": "Essence",
      "dateExpiration": "2024-12-31T00:00:00.000Z"
    }
  }
}
```

### 2. Récupérer tous les véhicules

**GET** `/vehicules`

Récupère la liste paginée des véhicules.

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
      "total": 25,
      "per_page": 10,
      "current_page": 1,
      "last_page": 3
    },
    "data": [
      {
        "id": 1,
        "marque": "Renault",
        "modele": "Clio",
        "type": "Citadine",
        "immatriculation": "AB-123-CD",
        "annee": 2020,
        "proprietaire": {
          "id": 1,
          "prenom": "Jean",
          "nom": "Dupont"
        }
      }
    ]
  }
}
```

### 3. Récupérer un véhicule par ID avec tous ses éléments

**GET** `/vehicules/:id`

Récupère les détails d'un véhicule avec tous ses éléments actifs.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "vehicule": {
      "id": 1,
      "marque": "Renault",
      "modele": "Clio",
      "type": "Citadine",
      "immatriculation": "AB-123-CD",
      "annee": 2020,
      "couleur": "Blanc",
      "proprietaire": {
        "id": 1,
        "prenom": "Jean",
        "nom": "Dupont"
      }
    },
    "carteGrise": {
      "id": 1,
      "numero": "CG123456789",
      "dateExpiration": "2030-01-15T00:00:00.000Z"
    },
    "assurance": {
      "id": 1,
      "numero": "ASS123456789",
      "compagnie": "AXA",
      "dateFin": "2025-01-01T00:00:00.000Z"
    },
    "vignette": {
      "id": 1,
      "numero": "VIG123456789",
      "dateExpiration": "2024-12-31T00:00:00.000Z"
    },
    "visiteTechnique": {
      "id": 1,
      "numero": "VT123456789",
      "resultat": "Favorable",
      "dateExpiration": "2025-01-15T00:00:00.000Z"
    },
    "carteBleue": {
      "id": 1,
      "numero": "CB123456789",
      "type": "Essence",
      "dateExpiration": "2024-12-31T00:00:00.000Z"
    }
  }
}
```

### 4. Mettre à jour un véhicule

**PUT** `/vehicules/:id`

Met à jour les informations d'un véhicule.

#### Corps de la requête
```json
{
  "marque": "Renault",
  "modele": "Clio V",
  "couleur": "Bleu"
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Véhicule mis à jour avec succès",
  "data": {
    "id": 1,
    "marque": "Renault",
    "modele": "Clio V",
    "couleur": "Bleu",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Supprimer un véhicule

**DELETE** `/vehicules/:id`

Supprime un véhicule et tous ses éléments associés.

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Véhicule supprimé avec succès"
}
```

### 6. Ajouter un conducteur à un véhicule

**POST** `/vehicules/:id/conducteurs`

Associe un conducteur à un véhicule.

#### Corps de la requête
```json
{
  "conducteurId": 1
}
```

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Conducteur ajouté au véhicule avec succès",
  "data": {
    "id": 1,
    "marque": "Renault",
    "modele": "Clio",
    "conducteurs": [
      {
        "id": 1,
        "prenom": "Jean",
        "nom": "Dupont"
      }
    ]
  }
}
```

### 7. Retirer un conducteur d'un véhicule

**DELETE** `/vehicules/:id/conducteurs/:conducteurId`

Retire l'association entre un conducteur et un véhicule.

#### Réponse de succès (200)
```json
{
  "success": true,
  "message": "Conducteur retiré du véhicule avec succès"
}
```

### 8. Récupérer les conducteurs d'un véhicule

**GET** `/vehicules/:id/conducteurs`

Récupère tous les conducteurs associés à un véhicule.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "prenom": "Jean",
      "nom": "Dupont",
      "telephone": "+33123456789"
    }
  ]
}
```

### 9. Rechercher des véhicules

**GET** `/vehicules/search?q=renault`

Recherche des véhicules par marque, modèle, immatriculation ou propriétaire.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "marque": "Renault",
      "modele": "Clio",
      "immatriculation": "AB-123-CD",
      "proprietaire": {
        "id": 1,
        "prenom": "Jean",
        "nom": "Dupont"
      }
    }
  ]
}
```

### 10. Statistiques des véhicules

**GET** `/vehicules/stats`

Récupère les statistiques des véhicules.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "total": 25,
    "parType": {
      "Citadine": 10,
      "SUV": 8,
      "Berline": 5,
      "Utilitaire": 2
    },
    "parMarque": {
      "Renault": 8,
      "Peugeot": 6,
      "Citroën": 4
    }
  }
}
```

### 11. Historique complet d'un véhicule

**GET** `/vehicules/:id/historique`

Récupère l'historique complet d'un véhicule avec tous ses éléments.

#### Réponse de succès (200)
```json
{
  "success": true,
  "data": {
    "vehicule": {
      "id": 1,
      "marque": "Renault",
      "modele": "Clio"
    },
    "carteGrise": [
      {
        "id": 1,
        "numero": "CG123456789",
        "dateDelivrance": "2020-01-15",
        "dateExpiration": "2030-01-15"
      }
    ],
    "assurances": [
      {
        "id": 1,
        "numero": "ASS123456789",
        "compagnie": "AXA",
        "dateDebut": "2024-01-01",
        "dateFin": "2025-01-01"
      }
    ],
    "vignettes": [
      {
        "id": 1,
        "numero": "VIG123456789",
        "dateDelivrance": "2024-01-01",
        "dateExpiration": "2024-12-31"
      }
    ],
    "visitesTechniques": [
      {
        "id": 1,
        "numero": "VT123456789",
        "resultat": "Favorable",
        "dateVisite": "2024-01-15",
        "dateExpiration": "2025-01-15"
      }
    ],
    "cartesBleues": [
      {
        "id": 1,
        "numero": "CB123456789",
        "type": "Essence",
        "dateDelivrance": "2024-01-01",
        "dateExpiration": "2024-12-31"
      }
    ]
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
  "message": "Véhicule non trouvé"
}
```

### 409 - Conflict
```json
{
  "success": false,
  "message": "Un véhicule avec cette immatriculation existe déjà"
}
```

## Authentification

Toutes les routes nécessitent une authentification. Incluez le token dans le header :

```
Authorization: Bearer <votre_token_jwt>
```

## Validation des Données

### Véhicule
- **Marque/Modèle** : 2-100 caractères
- **Type** : 2-50 caractères
- **Immatriculation** : 5-20 caractères, unique
- **Année** : Entre 1900 et année actuelle + 1
- **Couleur** : Maximum 50 caractères

### Carte Grise
- **Numéro** : 5-50 caractères, unique
- **Dates** : Date d'expiration > date de délivrance

### Assurance
- **Numéro** : 5-50 caractères, unique
- **Compagnie** : 2-100 caractères
- **Dates** : Date de fin > date de début
- **Montant** : Positif

### Vignette
- **Numéro** : 5-50 caractères, unique
- **Dates** : Date d'expiration > date de délivrance
- **Montant** : Positif

### Visite Technique
- **Numéro** : 5-50 caractères, unique
- **Centre** : 2-100 caractères
- **Résultat** : Favorable, Défavorable, Avec réserves
- **Dates** : Date d'expiration > date de visite

### Carte Bleue
- **Numéro** : 5-50 caractères, unique
- **Type** : Essence, Diesel, Électrique, Hybride
- **Dates** : Date d'expiration > date de délivrance
- **Montant** : Positif

## Fonctionnalités Avancées

1. **Création en lot** : Création d'un véhicule avec tous ses éléments en une requête
2. **Gestion des erreurs partielles** : Si un élément échoue, les autres sont créés
3. **Historique complet** : Accès à tous les éléments passés et présents
4. **Recherche avancée** : Multi-critères avec pagination
5. **Statistiques détaillées** : Par type, marque, etc.
6. **Gestion des relations** : Many-to-many avec les conducteurs 