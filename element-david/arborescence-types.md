# ARBORESCENCE DÉTAILLÉE PAR TYPE D'ÉLÉMENT

## AUTHENTIFICATION
- [PAGE] **Page de connexion**
  - [COMPOSANT] Formulaire d'authentification
  - [COMPOSANT] Sélecteur de profil (admin, comptable, gestion, production, pro)
- [PAGE] **Page de récupération de mot de passe**

## MODULE 1: TABLEAU DE BORD
- [PAGE] **Tableau de bord principal**
  - [COMPOSANT] Bandeau de métriques
    - [WIDGET] Compteur Nouveaux dossiers
    - [WIDGET] Compteur Attente pièces
    - [WIDGET] Compteur Complétés
    - [WIDGET] Compteur Prêt dépôt
    - [WIDGET] Compteur En instruction
    - [WIDGET] Compteur TOP URGENT
  - [VUE] Liste des dossiers en cours
    - [COMPOSANT] Filtres et recherche
    - [COMPOSANT] Tableau de données paginé
    - [BOUTON] Créer un nouveau dossier
    - [BOUTON] Exporter

- [PAGE] **Détail d'un dossier**
  - [ONGLET] Informations générales
    - [COMPOSANT] Informations client
    - [COMPOSANT] Informations dossier
    - [COMPOSANT] Statut et priorité
  - [ONGLET] Timeline de progression (workflow)
    - [COMPOSANT] Étapes du workflow
    - [COMPOSANT] Documents associés à chaque étape
      - [BOUTON] Ajouter un document
      - [BOUTON] Visualiser
      - [BOUTON] Télécharger
    - [COMPOSANT] Système de messagerie par étape
      - [BOUTON] Ajouter un commentaire
  - [ONGLET] Gestion des tâches
    - [COMPOSANT] Liste des tâches assignées
    - [COMPOSANT] Filtres de tâches
      - [FILTRE] Par statut (En cours, En attente, Terminées)
      - [FILTRE] Par personne assignée
    - [BOUTON] Créer une tâche

## MODULE 2: GESTION DES CLIENTS
- [PAGE] **Liste des clients**
  - [COMPOSANT] Tableau clients avec recherche et filtres
    - [COLONNE] Identifiant
    - [COLONNE] Nom client
    - [COLONNE] Type (Pro/Particulier)
    - [COLONNE] Contact
    - [COLONNE] Ville
    - [COLONNE] Actions
  - [BOUTON] Ajouter un client

- [PAGE] **Création/modification de client**
  - [VUE] Formulaire de création client initial
    - [CHAMP] Nom/Prénom
    - [CHAMP] Type client
    - [CHAMP] Coordonnées
    - [CHAMP] Adresse
  - [VUE] Option d'envoi du lien au client
    - [BOUTON] Générer lien sécurisé
    - [BOUTON] Envoyer par email
  
- [PAGE] **Fiche client complète**
  - [ONGLET] Informations client
    - [SECTION] Coordonnées
    - [SECTION] Informations administratives
    - [SECTION] Historique des contacts
  - [ONGLET] Documents client
    - [COMPOSANT] Liste des documents
    - [BOUTON] Ajouter un document
  - [ONGLET] Projets associés
    - [COMPOSANT] Liste des projets
    - [BOUTON] Créer un nouveau projet
  
- [PAGE] **Générateur de formulaires**
  - [ONGLET] Générateur CERFA
    - [COMPOSANT] Sélecteur de type CERFA
    - [BOUTON] Générer CERFA pré-rempli
    - [BOUTON] Télécharger
  - [ONGLET] Documents cadastraux
    - [COMPOSANT] Recherche de parcelle
    - [BOUTON] Récupérer automatiquement
  - [ONGLET] Documents PLU
    - [COMPOSANT] Sélection de zone
    - [BOUTON] Récupérer réglementation

## MODULE 3: GESTION COMPTABLE
- [PAGE] **Tableau de comptabilité**
  - [ONGLET] Vue globale
    - [COMPOSANT] Filtres professionnels
    - [COMPOSANT] Tableau des transactions
      - [COLONNE] Client
      - [COLONNE] Pro
      - [COLONNE] Devis Total
      - [COLONNE] Acompte
      - [COLONNE] Solde
      - [COLONNE] N° Devis
      - [COLONNE] N° Facture
      - [COLONNE] État
      - [COLONNE] Méthode
      - [COLONNE] Actions
    - [COMPOSANT] Métriques financières
      - [WIDGET] Chiffre d'affaires total
      - [WIDGET] Acomptes perçus
      - [WIDGET] Soldes perçus
      - [WIDGET] Taux de recouvrement
  - [ONGLET] Facturation Pro
  - [ONGLET] Paiements
  - [ONGLET] Statistiques

- [PAGE] **Création/modification document financier**
  - [VUE] Générateur de devis
    - [COMPOSANT] Formulaire devis
    - [COMPOSANT] Lignes produits/services
    - [BOUTON] Calculer
    - [BOUTON] Prévisualiser
    - [BOUTON] Enregistrer
  - [VUE] Générateur de facture
    - [COMPOSANT] Formulaire facture
    - [COMPOSANT] Options de paiement
    - [BOUTON] Envoyer
  - [VUE] Suivi des paiements
    - [COMPOSANT] Tableau paiements
    - [COMPOSANT] Filtres (Payé, En attente, En retard)

## MODULE 4: GESTION DES UTILISATEURS
- [PAGE] **Liste des utilisateurs**
  - [COMPOSANT] Tableau des utilisateurs
    - [COLONNE] Nom
    - [COLONNE] Email
    - [COLONNE] Rôle
    - [COLONNE] Statut
    - [COLONNE] Dernière connexion
    - [COLONNE] Actions
  - [BOUTON] Ajouter un utilisateur

- [PAGE] **Création/modification utilisateur**
  - [VUE] Formulaire utilisateur
    - [CHAMP] Nom/Prénom
    - [CHAMP] Email
    - [CHAMP] Mot de passe
    - [CHAMP] Statut
  - [VUE] Attribution des rôles
    - [COMPOSANT] Sélecteur de rôle
    - [COMPOSANT] Permissions spécifiques

- [PAGE] **Configuration système**
  - [ONGLET] Paramètres notifications
    - [SWITCH] Notifications par email
    - [SWITCH] Notifications nouveaux dossiers
    - [SWITCH] Notifications d'échéances
    - [SWITCH] Relances automatiques
  - [ONGLET] Configuration relances
    - [CHAMP] Délai avant première relance
    - [CHAMP] Fréquence des relances
    - [CHAMP] Nombre maximum de relances
    - [ÉDITEUR] Modèle d'email de relance
  - [ONGLET] Intégrations externes
    - [SECTION] Configuration Cadastre
      - [CHAMP] URL API Cadastre
      - [CHAMP] Clé API
      - [SWITCH] Téléchargement automatique
    - [SECTION] Configuration PLU
      - [CHAMP] URL Service urbanisme
      - [CHAMP] Identifiant de service
      - [SWITCH] Mise à jour auto des PLU
  - [ONGLET] Configuration facturation
    - [SECTION] Paramètres des factures
      - [CHAMP] Préfixe numéros
      - [CHAMP] Délai de paiement
      - [CHAMP] Taux TVA
    - [SECTION] Paramètres des devis
      - [CHAMP] Durée de validité
      - [CHAMP] Acompte par défaut

## MODULE 5: GESTION DES MODÈLES
- [PAGE] **Gestion des modèles emails**
  - [VUE] Liste des modèles par catégorie
    - [CATÉGORIE] Communication client
    - [CATÉGORIE] Facturation
    - [CATÉGORIE] Gestion de dossier
    - [CATÉGORIE] Relances
  - [VUE] Éditeur de modèle
    - [CHAMP] Objet de l'email
    - [ÉDITEUR] Corps du message
    - [COMPOSANT] Options de formatage
  - [COMPOSANT] Gestionnaire de variables
    - [VARIABLE] {RÉFÉRENCE}
    - [VARIABLE] {NOM_CLIENT}
    - [VARIABLE] Plus...

## ACCÈS PAR PROFIL
- [ACCÈS] **ADMIN**: Tous les modules
- [ACCÈS] **COMPTABLE**: 
  - Tableau de bord (vue restreinte)
  - Gestion des clients
  - Gestion comptable (accès complet)
- [ACCÈS] **GESTION**: 
  - Tableau de bord
  - Gestion des clients
  - Gestion comptable (vue restreinte)
  - Gestion des modèles de communication
- [ACCÈS] **PRODUCTION**: 
  - Tableau de bord
  - Gestion des clients (vue technique)
  - Générateur de formulaires
- [ACCÈS] **CLIENT PRO**: 
  - Tableau de bord personnalisé (uniquement ses dossiers)
  - Liste de ses clients
  - Création de fiches clients pour ses propres clients
  - Suivi des dossiers et étapes

## STRUCTURE DE STOCKAGE
- [DOSSIER] `/année/type_client/Nom_Client/`
  - [DOSSIER] `fiche_client/`
  - [DOSSIER] `cerfa/`
  - [DOSSIER] `documents/`
  - [DOSSIER] `cadastre/`
  - [DOSSIER] `plu/`
  - [DOSSIER] `faisabilite/`
  - [DOSSIER] `comptabilite/`
  - [DOSSIER] `divers/`