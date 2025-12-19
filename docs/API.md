# Documentation API SkillMatch

## Table des matières

- [Freelances](#freelances)
- [Entreprises](#entreprises)
- [Projets](#projets)
- [Codes de statut HTTP](#codes-de-statut-http)
- [Format des données](#format-des-données)

## Base URL

```
http://localhost:3000
```

## Freelances

### Créer un freelance

Crée un nouveau freelance dans le système.

**Endpoint**: `POST /api/freelances`

**Body**:
```json
{
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "skills": "JavaScript,TypeScript,React,Node.js",
  "tjm": 500
}
```

**Réponse** (201 Created):
```json
{
  "id": 1,
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "tjm": 500
}
```

**Erreurs possibles**:
- `400 Bad Request`: Données invalides
- `409 Conflict`: Email déjà utilisé

---

### Récupérer tous les freelances

Retourne la liste de tous les freelances enregistrés.

**Endpoint**: `GET /api/freelances`

**Réponse** (200 OK):
```json
[
  {
    "id": 1,
    "nom": "Alice Dupont",
    "email": "alice@example.com",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
    "tjm": 500
  },
  {
    "id": 2,
    "nom": "Bob Martin",
    "email": "bob@example.com",
    "skills": ["Python", "Django", "PostgreSQL"],
    "tjm": 450
  }
]
```

---

### Récupérer un freelance par ID

Retourne les détails d'un freelance spécifique.

**Endpoint**: `GET /api/freelances/:id`

**Paramètres URL**:
- `id` (number): L'identifiant du freelance

**Réponse** (200 OK):
```json
{
  "id": 1,
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
  "tjm": 500
}
```

**Erreurs possibles**:
- `404 Not Found`: Freelance introuvable

---

### Obtenir les projets compatibles

Retourne tous les projets compatibles avec les compétences et le TJM du freelance.

**Endpoint**: `GET /api/freelances/:id/projets-compatibles`

**Paramètres URL**:
- `id` (number): L'identifiant du freelance

**Réponse** (200 OK):
```json
[
  {
    "id": 1,
    "titre": "Développement application mobile",
    "description": "Application de gestion pour iOS et Android",
    "skillsRequis": ["JavaScript", "React"],
    "budgetMaxTjm": 600,
    "entrepriseId": 1,
    "entreprise": {
      "id": 1,
      "nom": "TechCorp",
      "secteur": "Technologie"
    },
    "matchScore": 100,
    "freelanceId": null
  },
  {
    "id": 2,
    "titre": "Refonte site web",
    "description": "Modernisation du site vitrine",
    "skillsRequis": ["JavaScript", "React", "TypeScript"],
    "budgetMaxTjm": 550,
    "entrepriseId": 2,
    "entreprise": {
      "id": 2,
      "nom": "WebAgency",
      "secteur": "Digital"
    },
    "matchScore": 75,
    "freelanceId": null
  }
]
```

**Description des champs**:
- `matchScore`: Score de compatibilité entre 0 et 100 basé sur les compétences
- Les projets sont triés par score décroissant
- Seuls les projets non attribués (`freelanceId: null`) sont retournés

**Erreurs possibles**:
- `404 Not Found`: Freelance introuvable

---

### Postuler à un projet

Permet à un freelance de postuler à un projet compatible.

**Endpoint**: `POST /api/freelances/:id/postuler`

**Paramètres URL**:
- `id` (number): L'identifiant du freelance

**Body**:
```json
{
  "projetId": 1
}
```

**Réponse** (200 OK):
```json
{
  "success": true,
  "message": "Candidature enregistrée avec succès",
  "projet": {
    "id": 1,
    "titre": "Développement application mobile",
    "description": "Application de gestion pour iOS et Android",
    "skillsRequis": ["JavaScript", "React"],
    "budgetMaxTjm": 600,
    "entrepriseId": 1,
    "freelanceId": 1
  }
}
```

**Erreurs possibles**:
- `400 Bad Request`: Projet déjà attribué, compétences manquantes, TJM trop élevé
- `404 Not Found`: Freelance ou projet introuvable

**Exemple d'erreur** (400):
```json
{
  "error": "Compétences manquantes: python, django"
}
```

---

## Entreprises

### Créer une entreprise

Crée une nouvelle entreprise dans le système.

**Endpoint**: `POST /api/entreprises`

**Body**:
```json
{
  "nom": "TechCorp",
  "secteur": "Technologie"
}
```

**Réponse** (201 Created):
```json
{
  "id": 1,
  "nom": "TechCorp",
  "secteur": "Technologie"
}
```

**Erreurs possibles**:
- `400 Bad Request`: Données invalides

---

### Récupérer toutes les entreprises

Retourne la liste de toutes les entreprises enregistrées.

**Endpoint**: `GET /api/entreprises`

**Réponse** (200 OK):
```json
[
  {
    "id": 1,
    "nom": "TechCorp",
    "secteur": "Technologie"
  },
  {
    "id": 2,
    "nom": "WebAgency",
    "secteur": "Digital"
  }
]
```

---

### Récupérer une entreprise par ID

Retourne les détails d'une entreprise spécifique.

**Endpoint**: `GET /api/entreprises/:id`

**Paramètres URL**:
- `id` (number): L'identifiant de l'entreprise

**Réponse** (200 OK):
```json
{
  "id": 1,
  "nom": "TechCorp",
  "secteur": "Technologie"
}
```

**Erreurs possibles**:
- `404 Not Found`: Entreprise introuvable

---

### Créer un projet

Crée un nouveau projet pour une entreprise.

**Endpoint**: `POST /api/entreprises/:id/projets`

**Paramètres URL**:
- `id` (number): L'identifiant de l'entreprise

**Body**:
```json
{
  "titre": "Développement application mobile",
  "description": "Application de gestion pour iOS et Android",
  "skillsRequis": "JavaScript,React,React Native",
  "budgetMaxTjm": 600
}
```

**Réponse** (201 Created):
```json
{
  "id": 1,
  "titre": "Développement application mobile",
  "description": "Application de gestion pour iOS et Android",
  "skillsRequis": ["JavaScript", "React", "React Native"],
  "budgetMaxTjm": 600,
  "entrepriseId": 1,
  "freelanceId": null
}
```

**Erreurs possibles**:
- `400 Bad Request`: Données invalides
- `404 Not Found`: Entreprise introuvable

---

### Récupérer les projets d'une entreprise

Retourne tous les projets d'une entreprise.

**Endpoint**: `GET /api/entreprises/:id/projets`

**Paramètres URL**:
- `id` (number): L'identifiant de l'entreprise

**Réponse** (200 OK):
```json
[
  {
    "id": 1,
    "titre": "Développement application mobile",
    "description": "Application de gestion pour iOS et Android",
    "skillsRequis": ["JavaScript", "React", "React Native"],
    "budgetMaxTjm": 600,
    "entrepriseId": 1,
    "freelanceId": 1,
    "freelance": {
      "id": 1,
      "nom": "Alice Dupont",
      "email": "alice@example.com",
      "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
      "tjm": 500
    }
  },
  {
    "id": 2,
    "titre": "Refonte backend",
    "description": "Migration vers une architecture microservices",
    "skillsRequis": ["Node.js", "TypeScript", "Docker"],
    "budgetMaxTjm": 700,
    "entrepriseId": 1,
    "freelanceId": null
  }
]
```

**Erreurs possibles**:
- `404 Not Found`: Entreprise introuvable

---

### Obtenir les candidats compatibles

Retourne tous les freelances compatibles avec un projet spécifique.

**Endpoint**: `GET /api/entreprises/:id/projets/:projetId/candidats-compatibles`

**Paramètres URL**:
- `id` (number): L'identifiant de l'entreprise
- `projetId` (number): L'identifiant du projet

**Réponse** (200 OK):
```json
[
  {
    "id": 1,
    "nom": "Alice Dupont",
    "email": "alice@example.com",
    "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
    "tjm": 500,
    "matchScore": 100
  },
  {
    "id": 3,
    "nom": "Charlie Wilson",
    "email": "charlie@example.com",
    "skills": ["JavaScript", "React", "Vue.js"],
    "tjm": 550,
    "matchScore": 66
  }
]
```

**Description des champs**:
- `matchScore`: Score de compatibilité entre 0 et 100 basé sur les compétences
- Les candidats sont triés par score décroissant
- Seuls les candidats dont le TJM est inférieur ou égal au budget sont retournés

**Erreurs possibles**:
- `404 Not Found`: Entreprise ou projet introuvable

---

## Projets

### Récupérer tous les projets ouverts (BONUS)

Retourne tous les projets qui n'ont pas encore été attribués à un freelance.

**Endpoint**: `GET /api/projets/ouverts`

**Réponse** (200 OK):
```json
[
  {
    "id": 2,
    "titre": "Refonte backend",
    "description": "Migration vers une architecture microservices",
    "skillsRequis": ["Node.js", "TypeScript", "Docker"],
    "budgetMaxTjm": 700,
    "entrepriseId": 1,
    "entreprise": {
      "id": 1,
      "nom": "TechCorp",
      "secteur": "Technologie"
    },
    "freelanceId": null
  },
  {
    "id": 3,
    "titre": "Application e-commerce",
    "description": "Plateforme de vente en ligne",
    "skillsRequis": ["React", "Node.js", "MongoDB"],
    "budgetMaxTjm": 650,
    "entrepriseId": 2,
    "entreprise": {
      "id": 2,
      "nom": "WebAgency",
      "secteur": "Digital"
    },
    "freelanceId": null
  }
]
```

---

## Codes de statut HTTP

| Code | Description |
|------|-------------|
| 200 | OK - La requête a réussi |
| 201 | Created - La ressource a été créée avec succès |
| 400 | Bad Request - Données invalides ou incompatibles |
| 404 | Not Found - Ressource introuvable |
| 409 | Conflict - Conflit (ex: email déjà utilisé) |
| 500 | Internal Server Error - Erreur serveur |

---

## Format des données

### Compétences (Skills)

Les compétences sont stockées sous forme de chaîne de caractères séparées par des virgules:

**Format d'envoi** (string):
```json
"JavaScript,TypeScript,React,Node.js"
```

**Format de retour** (array):
```json
["JavaScript", "TypeScript", "React", "Node.js"]
```

**Notes**:
- Les espaces autour des virgules sont automatiquement supprimés
- La comparaison des compétences est insensible à la casse
- Les compétences vides sont ignorées

### TJM (Taux Journalier Moyen)

Le TJM est exprimé en euros (nombre entier).

**Exemple**: `500` = 500€ par jour

### Match Score

Le score de compatibilité est calculé selon la formule:

```
Score = (Nombre de compétences correspondantes / Nombre de compétences requises) × 100
```

**Exemples**:
- Freelance avec `["JavaScript", "React", "TypeScript"]`
- Projet requérant `["JavaScript", "React"]`
- Score = (2/2) × 100 = **100%**

---

- Freelance avec `["JavaScript", "React", "Vue.js"]`
- Projet requérant `["JavaScript", "React", "TypeScript"]`
- Score = (2/3) × 100 = **67%**

### Compatibilité

Un freelance est compatible avec un projet si:
1. Il possède toutes les compétences requises
2. Son TJM est inférieur ou égal au budget maximum du projet
3. Le projet n'est pas déjà attribué (`freelanceId === null`)

---

## Exemples de scénarios

### Scénario 1: Créer un freelance et trouver des projets

```bash
# 1. Créer le freelance
POST /api/freelances
{
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "skills": "JavaScript,TypeScript,React",
  "tjm": 500
}

# 2. Trouver les projets compatibles
GET /api/freelances/1/projets-compatibles

# 3. Postuler au meilleur projet
POST /api/freelances/1/postuler
{
  "projetId": 1
}
```

### Scénario 2: Créer une entreprise avec un projet et trouver des candidats

```bash
# 1. Créer l'entreprise
POST /api/entreprises
{
  "nom": "TechCorp",
  "secteur": "Technologie"
}

# 2. Créer un projet
POST /api/entreprises/1/projets
{
  "titre": "Application mobile",
  "description": "Développement iOS/Android",
  "skillsRequis": "JavaScript,React Native",
  "budgetMaxTjm": 600
}

# 3. Trouver les candidats compatibles
GET /api/entreprises/1/projets/1/candidats-compatibles
```

### Scénario 3: Consulter tous les projets disponibles

```bash
# Voir tous les projets non attribués
GET /api/projets/ouverts
```
