# Architecture avec Injection de Dépendances (DI)

## Vue d'ensemble

L'application utilise un pattern d'**Injection de Dépendances** pour améliorer la testabilité, la maintenabilité et le découplage du code.

## Structure des dossiers

```
src/
├── config/
│   ├── dependencies.ts          # Configuration centralisée des dépendances
│   └── orm/
│       └── prisma.ts            # Configuration client Prisma
├── types/
│   ├── dtos/                    # Data Transfer Objects
│   │   ├── freelance.dto.ts     # DTOs freelance
│   │   ├── entreprise.dto.ts    # DTOs entreprise
│   │   ├── projet.dto.ts        # DTOs projet
│   │   └── index.ts             # Exports des DTOs
│   ├── index.ts                 # Types métier et Props
│   └── dependencies.ts          # Interfaces de dépendances
├── controllers/
│   ├── freelances.controller.ts # Controller freelances avec DI
│   └── entreprises.controller.ts# Controller entreprises avec DI
├── services/
│   ├── freelances.service.ts    # Logique métier freelances
│   ├── entreprises.service.ts   # Logique métier entreprises
│   └── matching.service.ts      # Logique de matching
├── repositories/
│   ├── freelance.repository.ts  # Accès aux données freelances
│   ├── entreprise.repository.ts # Accès aux données entreprises
│   └── projet.repository.ts     # Accès aux données projets
├── mappers/
│   ├── freelance.mapper.ts      # Transformation des données freelances
│   ├── entreprise.mapper.ts     # Transformation des données entreprises
│   └── projet.mapper.ts         # Transformation des données projets
└── routers/
    ├── index.ts                 # Router principal avec DI
    ├── freelances.router.ts     # Router freelances avec DI
    ├── entreprises.router.ts    # Router entreprises avec DI
    └── projets.router.ts        # Router projets
```

## Principes de conception

### 1. Injection de Dépendances (DI)

**Pourquoi ?**
- ✅ **Testabilité** : Facile de mocker les dépendances dans les tests
- ✅ **Découplage** : Les composants ne créent pas leurs dépendances
- ✅ **Flexibilité** : Facile de changer l'implémentation sans toucher au code
- ✅ **Maintenabilité** : Configuration centralisée des dépendances

**Comment ?**
```typescript
// 1. Définir les interfaces de dépendances
export interface ServiceDependencies {
  freelancesService: typeof FreelancesService;
}

// 2. Créer le container de dépendances
export function createDependencies(): AppDependencies {
  return {
    services: {
      freelancesService: FreelancesService,
    },
  };
}

// 3. Injecter dans les controllers
export class FreelancesController {
  constructor(private readonly dependencies: ServiceDependencies) {}
}

// 4. Utiliser dans les routers
export function createFreelancesRouter(dependencies: ServiceDependencies): Router {
  const controller = new FreelancesController(dependencies);
  // ...
}
```

### 2. Single Responsibility Principle (SRP)

Chaque classe a une seule responsabilité :

- **Controllers** : Gestion des requêtes HTTP et réponses
- **Services** : Logique métier et orchestration
- **Repositories** : Accès aux données (CRUD)
- **Mappers** : Transformation des données

### 3. Props Types

Toutes les méthodes avec plusieurs paramètres utilisent des Props :

```typescript
// ❌ Avant
static async postulerProjet(freelanceId: number, projetId: number): Promise<MatchingResult>

// ✅ Après
static async postulerProjet(props: PostulerProjetProps): Promise<MatchingResult>
```

**Avantages** :
- Paramètres nommés et explicites
- Meilleure documentation
- Refactoring plus sûr
- Auto-complétion améliorée

### 4. Organisation des Types

**DTOs (Data Transfer Objects)** : Séparés dans `types/dtos/`

```typescript
// types/dtos/freelance.dto.ts
export interface CreateFreelanceDto { ... }
export interface FreelanceDto { ... }

// types/dtos/entreprise.dto.ts
export interface CreateEntrepriseDto { ... }
export interface EntrepriseDto { ... }

// types/dtos/projet.dto.ts
export interface CreateProjetDto { ... }
export interface ProjetDto { ... }
```

**Props Types** : Dans `types/index.ts`
- Props pour les méthodes de services
- Props pour les fonctions utilitaires

**Avantages** :
- DTOs clairement séparés des types métier
- Facilite la réutilisation
- Meilleure organisation du code
- Compatible avec la validation (class-validator)

### 5. Configuration ORM

La configuration Prisma est dans `config/orm/prisma.ts` pour:
- Centraliser la configuration de la base de données
- Faciliter le changement d'ORM si nécessaire
- Séparer les préoccupations (config vs code métier)

### 6. TypeScript strict

- Pas d'utilisation de `as` (type assertions)
- Type guards pour les conversions
- Types explicites partout
- Pas de `any`

## Flow de l'application

```
index.ts (main)
    ↓
createDependencies() → DI Container
    ↓
createAppRouter(dependencies)
    ↓
createFreelancesRouter(dependencies.services)
    ↓
new FreelancesController(dependencies)
    ↓
controller.method() → service.method() → repository.method()
```

## Exemple d'utilisation

### Ajouter un nouveau endpoint

1. **Ajouter la méthode dans le service**
```typescript
// services/freelances.service.ts
static async updateFreelance(props: UpdateFreelanceProps): Promise<FreelanceWithSkills> {
  // logique métier
}
```

2. **Ajouter la méthode dans le controller**
```typescript
// controllers/freelances.controller.ts
async updateFreelance(req: Request, res: Response): Promise<void> {
  const freelance = await this.dependencies.freelancesService.updateFreelance(req.body);
  res.json(freelance);
}
```

3. **Ajouter la route**
```typescript
// routers/freelances.router.ts
router.put("/:id", (req, res) => controller.updateFreelance(req, res));
```

### Tester avec des mocks

```typescript
// __tests__/freelances.controller.test.ts
const mockDependencies: ServiceDependencies = {
  freelancesService: {
    getAllFreelances: jest.fn(),
    // ...
  } as any,
};

const controller = new FreelancesController(mockDependencies);
```

## Avantages de cette architecture

### Testabilité
- Injection de mocks facile
- Tests unitaires isolés
- Pas de dépendances globales

### Maintenabilité
- Code organisé par responsabilité
- Configuration centralisée
- Facile à refactoriser

### Scalabilité
- Ajout de nouveaux services simple
- Peut évoluer vers un vrai DI container (InversifyJS, tsyringe)
- Prêt pour les microservices

### Lisibilité
- Architecture claire et prévisible
- Flux de données explicite
- Documentation par le code
