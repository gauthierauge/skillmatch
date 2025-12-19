# SkillMatch

API de matching entre freelances et projets d'entreprises, permettant de mettre en relation les talents avec les opportunités de missions.

## Description

SkillMatch est une API REST qui permet de:
- Gérer des freelances avec leurs compétences et tarifs journaliers moyens (TJM)
- Gérer des entreprises et leurs projets
- Matcher automatiquement les freelances avec les projets compatibles
- Permettre aux freelances de postuler aux projets
- Trouver les meilleurs candidats pour un projet

## Prérequis

- Node.js (v20+)
- PostgreSQL (v14+)
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone git@github.com:gauthierauge/skillmatch.git
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer PostgreSQL avec Docker

Le projet utilise Docker pour PostgreSQL:

```bash
docker-compose up -d
```

La base de données sera accessible sur `localhost:5432` avec:
- User: `user`
- Password: `password`
- Database: `skillmatch`

### 4. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillmatch?schema=public"
PORT=3000
```

### 5. Configurer la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer et appliquer les migrations
npm run prisma:migrate

# (Optionnel) Ouvrir Prisma Studio pour visualiser les données
npm run prisma:studio
```

## Utilisation

### Démarrage en mode développement

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Build pour la production

```bash
npm run build
npm start
```

### Tests

```bash
# Lancer les tests en mode watch
npm test
```

## Commandes Docker utiles

```bash
# Démarrer PostgreSQL
docker-compose up -d

# Arrêter PostgreSQL
docker-compose down
```

## Utilisation avec Makefile

Un Makefile est disponible pour simplifier les commandes:

```bash
make install         # Installer les dépendances
make dev            # Démarrer en mode développement
make build          # Build pour la production
make test           # Lancer les tests
make prisma-migrate # Appliquer les migrations
make clean          # Nettoyer le projet
```

## API Endpoints

### Freelances

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/freelances` | Créer un nouveau freelance |
| GET | `/api/freelances` | Récupérer tous les freelances |
| GET | `/api/freelances/:id` | Récupérer un freelance par ID |
| GET | `/api/freelances/:id/projets-compatibles` | Obtenir les projets compatibles avec un freelance |
| POST | `/api/freelances/:id/postuler` | Postuler à un projet |

### Entreprises

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/entreprises` | Créer une nouvelle entreprise |
| GET | `/api/entreprises` | Récupérer toutes les entreprises |
| GET | `/api/entreprises/:id` | Récupérer une entreprise par ID |
| POST | `/api/entreprises/:id/projets` | Créer un projet pour une entreprise |
| GET | `/api/entreprises/:id/projets` | Récupérer les projets d'une entreprise |
| GET | `/api/entreprises/:id/projets/:projetId/candidats-compatibles` | Obtenir les candidats compatibles pour un projet |

### Projets (Bonus)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/projets/ouverts` | Récupérer tous les projets disponibles |

## Exemples d'utilisation

Voir le fichier [requests.http](requests.http) pour des exemples complets de requêtes HTTP.

### Créer un freelance

```bash
POST http://localhost:3000/api/freelances
Content-Type: application/json

{
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "skills": "JavaScript,TypeScript,React",
  "tjm": 500
}
```

### Créer une entreprise et un projet

```bash
# 1. Créer l'entreprise
POST http://localhost:3000/api/entreprises
Content-Type: application/json

{
  "nom": "TechCorp",
  "secteur": "Technologie"
}

# 2. Créer un projet pour cette entreprise
POST http://localhost:3000/api/entreprises/1/projets
Content-Type: application/json

{
  "titre": "Développement d'une application mobile",
  "description": "Application de gestion",
  "skillsRequis": "JavaScript,React",
  "budgetMaxTjm": 600
}
```

### Trouver des projets compatibles

```bash
GET http://localhost:3000/api/freelances/1/projets-compatibles
```

### Postuler à un projet

```bash
POST http://localhost:3000/api/freelances/1/postuler
Content-Type: application/json

{
  "projetId": 1
}
```

## Architecture

L'application suit une architecture en couches avec injection de dépendances:

- **Controllers**: Gestion des requêtes HTTP et des réponses
- **Services**: Logique métier et orchestration
- **Repositories**: Accès aux données (CRUD avec Prisma)
- **Mappers**: Transformation des données entre les couches
- **Types**: Définitions TypeScript des interfaces et types

Pour plus de détails sur l'architecture, voir [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Technologies utilisées

- **Express**: Framework web Node.js
- **TypeScript**: Langage typé
- **Prisma**: ORM pour PostgreSQL
- **PostgreSQL**: Base de données relationnelle
- **Vitest**: Framework de tests
- **ts-node-dev**: Rechargement à chaud en développement

## Structure du projet

```
SkillMatch/
├── src/
│   ├── config/          # Configuration (DI container)
│   ├── controllers/     # Controllers HTTP
│   ├── services/        # Logique métier
│   ├── repositories/    # Accès aux données
│   ├── mappers/         # Transformation des données
│   ├── routers/         # Définition des routes
│   ├── types/           # Types TypeScript
│   ├── lib/             # Utilitaires (client Prisma)
│   ├── app.ts           # Configuration Express
│   └── index.ts         # Point d'entrée
├── prisma/
│   └── schema.prisma    # Schéma de base de données
├── tests/               # Tests unitaires
├── docs/                # Documentation
└── package.json
```

## Contribution

Les contributions sont les bienvenues. Veuillez suivre ces étapes:

1. Fork le projet
2. Créer une branche pour votre feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

ISC
