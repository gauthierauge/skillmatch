# Tests SkillMatch

Ce dossier contient tous les tests du projet SkillMatch, organisés selon l'architecture du code source.

## Structure des tests

```
tests/
├── services/           # Tests unitaires des services
│   ├── matching.service.test.ts
│   ├── freelances.service.test.ts
│   └── entreprises.service.test.ts
└── controllers/        # Tests d'intégration des contrôleurs
    ├── freelances.controller.test.ts
    └── entreprises.controller.test.ts
```

## Exécuter les tests

### Avec npm

```bash
# Lancer les tests en mode watch (redémarre automatiquement)
npm run test

# Lancer les tests une seule fois
npm run test:run

# Lancer les tests avec l'interface UI
npm run test:ui

# Lancer les tests avec rapport de couverture
npm run test:coverage
```

### Avec Makefile

```bash
# Afficher toutes les commandes disponibles
make help

# Lancer les tests en mode watch
make test

# Lancer les tests une seule fois
make test-run

# Lancer les tests avec l'interface UI
make test-ui

# Lancer les tests avec rapport de couverture
make test-coverage
```

## Statistiques des tests

- **Total de tests**: 79
- **Services testés**: 3 (MatchingService, FreelancesService, EntreprisesService)
- **Contrôleurs testés**: 2 (FreelancesController, EntreprisesController)

### Répartition des tests

- **MatchingService**: 16 tests
  - 8 tests pour `checkCompatibility()`
  - 8 tests pour `calculateMatchScore()`

- **FreelancesService**: 19 tests
  - Tests CRUD de base
  - Tests de filtrage par compétences
  - Tests de compatibilité de projets
  - Tests de candidature

- **EntreprisesService**: 18 tests
  - Tests CRUD de base
  - Tests de gestion de projets
  - Tests de recherche de candidats compatibles
  - Tests de projets ouverts

- **FreelancesController**: 13 tests
  - Tests des endpoints HTTP
  - Tests des codes de statut
  - Tests de gestion d'erreurs

- **EntreprisesController**: 13 tests
  - Tests des endpoints HTTP
  - Tests des codes de statut
  - Tests de gestion d'erreurs

## Framework de test

Ce projet utilise **Vitest** comme framework de test, qui offre:
- Exécution rapide des tests
- Excellent support TypeScript
- Interface UI interactive
- Rapport de couverture de code
- API compatible avec Jest

## Mocking

Les tests utilisent `vi.mock()` de Vitest pour mocker:
- Les repositories (FreelanceRepository, ProjetRepository, EntrepriseRepository)
- Les services (pour les tests d'intégration des contrôleurs)

Cela permet de tester chaque couche de manière isolée.

## Bonnes pratiques

1. **Tests unitaires**: Testent une seule fonction/méthode de manière isolée
2. **Tests d'intégration**: Testent les endpoints HTTP avec des mocks de services
3. **Organisation**: Les tests suivent la même structure que le code source
4. **Nommage**: Les noms de tests décrivent clairement ce qui est testé
5. **Arrange-Act-Assert**: Structure claire de chaque test

## Exemples de commandes

```bash
# Exécuter uniquement les tests des services
npm run test services

# Exécuter uniquement les tests des contrôleurs
npm run test controllers

# Exécuter uniquement les tests d'un fichier spécifique
npm run test matching.service.test.ts

# Lancer les tests avec détails détaillés
npm run test -- --reporter=verbose
```
