# ARBORESCENCE TEXTUELLE DE L'APPLICATION DTAHC

## AUTHENTIFICATION
- Page de connexion
- Page de récupération de mot de passe

## MODULE 1: TABLEAU DE BORD
- Tableau de bord principal
  - Liste des dossiers en cours
  - Bandeau de métriques
  - Filtres de recherche
- Détail d'un dossier
  - Informations générales
  - Timeline de progression
    - Étapes du workflow
    - Documents associés
    - Système de messagerie
  - Gestion des tâches
    - Liste des tâches
    - Filtres de tâches

## MODULE 2: GESTION DES CLIENTS
- Liste des clients
  - Tableau clients avec filtres
- Création/modification client
  - Formulaire client initial
  - Envoi lien auto-remplissage
- Fiche client complète
  - Informations client
  - Documents client
  - Projets associés
- Générateur de formulaires
  - CERFA pré-rempli
  - Documents cadastraux
  - Documents PLU

## MODULE 3: GESTION COMPTABLE
- Tableau de comptabilité
  - Vue globale
  - Facturation Pro
  - Paiements
  - Statistiques
- Création document financier
  - Générateur de devis
  - Générateur de facture
  - Suivi des paiements

## MODULE 4: ADMINISTRATION
- Liste des utilisateurs
  - Tableau utilisateurs
- Création/modification utilisateur
  - Formulaire utilisateur
  - Attribution rôles
- Configuration système
  - Paramètres notifications
  - Configuration relances
  - Intégrations API externes
  - Configuration facturation

## MODULE 5: GESTION DES MODÈLES
- Modèles emails
  - Liste des modèles
  - Éditeur de modèle
  - Gestionnaire de variables

## ACCÈS PAR PROFIL
- ADMIN: Tous les modules
- COMPTABLE: Tableau de bord, Clients, Comptabilité
- GESTION: Tableau de bord, Clients, Comptabilité (restreint), Modèles
- PRODUCTION: Tableau de bord, Clients (technique), Formulaires
- CLIENT PRO: Tableau de bord personnalisé, Ses clients, Suivi

## STRUCTURE DE STOCKAGE
```
/année/type_client/Nom_Client/
├── fiche_client/
├── cerfa/
├── documents/
├── cadastre/
├── plu/
├── faisabilite/
├── comptabilite/
└── divers/
```