# Suivi du développement avec Claude

Ce fichier sert à suivre l'état d'avancement du projet DTAHC entre les sessions de développement avec Claude.

## Dernière mise à jour: 17/05/2025

## État global du projet

- [x] Structure du projet mise en place
- [x] Configuration de base (TypeScript, ESLint, Prettier)
- [x] Schéma de base de données Prisma
- [x] Module d'authentification backend
- [x] Module de gestion des utilisateurs backend
- [x] Composants d'interface de base frontend
- [x] Configuration Docker
- [ ] Module de gestion des clients
- [ ] Module de workflow
- [ ] Module de documents
- [ ] Module de comptabilité
- [ ] Intégration API Cadastre
- [ ] Intégration API Urbanisme
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API

## Modules

### Backend

| Module | État | Priorité | Description |
|--------|------|----------|-------------|
| Auth | ✅ Terminé | Haute | Authentification JWT avec refresh token |
| Users | ✅ Terminé | Haute | Gestion des utilisateurs avec rôles |
| Clients | 🔄 À faire | Haute | Gestion des clients et de leurs informations |
| Workflow | 🔄 À faire | Haute | Machine à états pour le suivi des dossiers |
| Documents | 🔄 À faire | Moyenne | Gestion documentaire et intégration MinIO |
| Cadastre | 🔄 À faire | Moyenne | Intégration API Cadastre IGN |
| Urbanisme | 🔄 À faire | Moyenne | Intégration API Géoportail Urbanisme |
| Accounting | 🔄 À faire | Basse | Gestion comptable et facturation |

### Frontend

| Module | État | Priorité | Description |
|--------|------|----------|-------------|
| Auth | ✅ Terminé | Haute | Pages de connexion et déconnexion |
| Dashboard | ✅ Terminé | Haute | Tableau de bord principal |
| Layout | ✅ Terminé | Haute | Structure commune de l'application |
| Clients | 🔄 À faire | Haute | Gestion des clients et formulaire |
| Dossiers | 🔄 À faire | Haute | Suivi et gestion des dossiers |
| Documents | 🔄 À faire | Moyenne | Upload et visualisation documents |
| Comptabilité | 🔄 À faire | Basse | Interface de facturation |

## Prochaines tâches

### Priorité Haute
1. Implémenter le module de gestion des clients backend
2. Créer le formulaire de création/édition client frontend
3. Implémenter le système de lien sécurisé pour formulaire auto-remplissable
4. Développer le module de workflow backend

### Priorité Moyenne
1. Intégrer MinIO pour le stockage de documents
2. Implémenter les services d'intégration Cadastre
3. Créer les interfaces de visualisation des documents

### Priorité Basse
1. Développer le module de comptabilité
2. Ajouter des fonctionnalités de rapports et statistiques

## Problèmes connus

| ID | Problème | Statut | Date | Solution |
|----|----------|--------|------|----------|
| - | - | - | - | - |

## Commandes utiles

```bash
# Démarrer l'application en mode développement
npm run dev

# Linter
npm run lint

# Vérification TypeScript
npm run typecheck

# Construire l'application
npm run build

# Générer les types Prisma
npm run db:generate

# Appliquer les changements Prisma à la base de données
npm run db:push
```

## Références

- Les fichiers de référence UI se trouvent dans `/Users/d972/dtahc-project/element-david`
- Documentation API Cadastre IGN: https://apicarto.ign.fr/api/doc/
- Documentation Géoportail Urbanisme: https://www.geoportail-urbanisme.gouv.fr/
- Documentation Prisma: https://www.prisma.io/docs/
- Documentation NestJS: https://docs.nestjs.com/
- Documentation Next.js: https://nextjs.org/docs