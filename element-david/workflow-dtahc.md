# Workflow de Gestion des Dossiers DTAHC

## 1. PHASE INITIALE

### 1.1 CRÉATION DU DOSSIER (INITIAL)
- **Responsable**: Admin ou Gestionnaire
- **Actions**:
  - Création de la fiche client avec informations minimales
  - Attribution d'un identifiant unique (ANNÉE-NUMÉRO)
  - Création de l'arborescence standardisée
  - Génération et envoi du lien sécurisé pour compléter le formulaire client
  - Enregistrement préliminaire dans le système de facturation (devis initial)
- **Statut visible**: NOUVEAU - EN ATTENTE INFORMATIONS
- **Délai cible**: 24h après contact initial

### 1.2 COLLECTE DES INFORMATIONS (ATTENTE PIÈCES)
- **Responsable**: Client + Suivi par Gestionnaire
- **Actions**:
  - Réception et remplissage du formulaire par le client
  - Suivi des relances automatiques (J+3, J+7)
  - Vérification préliminaire des informations reçues
  - Mise à jour du tableau de bord avec indicateur "Formulaire reçu"
  - Notification à l'équipe technique
- **Statut visible**: EN COURS - ATTENTE PIÈCES COMPLÉMENTAIRES
- **Délai cible**: 10 jours (relance manuelle si dépassement)

### 1.3 VALIDATION ADMINISTRATIVE
- **Responsable**: Gestionnaire ou Admin
- **Actions**:
  - Contrôle qualité des informations fournies
  - Vérification des documents uploadés
  - Demande éventuelle de compléments d'information
  - Validation du type de dossier à réaliser (AT, DP, PC...)
  - Confirmation du tarif appliqué
  - Premier acompte facturé et suivi de paiement
- **Statut visible**: EN COURS - VALIDATION ADMINISTRATIVE
- **Délai cible**: 48h après réception du formulaire complet

## 2. PHASE D'ÉTUDE

### 2.1 RÉCUPÉRATION DOCUMENTAIRE (ÉTUDE APS)
- **Responsable**: Gestionnaire ou Professionnel
- **Actions**:
  - Récupération des plans cadastraux via API
  - Acquisition des règlements d'urbanisme (PLU)
  - Identification des contraintes spécifiques (ABF, PPRI, etc.)
  - Stockage organisé des documents dans l'arborescence
  - Validation technique des contraintes identifiées
- **Statut visible**: EN COURS - ÉTUDE APS
- **Délai cible**: 48-72h

### 2.2 ANALYSE DE FAISABILITÉ
- **Responsable**: Professionnel ou Gestionnaire
- **Actions**:
  - Confrontation du projet aux règles d'urbanisme
  - Analyse des points de conformité/non-conformité
  - Rédaction rapport de faisabilité avec recommandations
  - Ajustement éventuel du projet (si nécessaire)
  - Communication avec le client pour validation
- **Statut visible**: EN COURS - ANALYSE DE FAISABILITÉ
- **Délai cible**: 3-5 jours ouvrés

### 2.3 RÉALISATION DU DOSSIER TECHNIQUE (DOSSIER COMPLET)
- **Responsable**: Professionnel
- **Actions**:
  - Élaboration des plans techniques
  - Rédaction des notices descriptives
  - Préparation des documents annexes
  - Génération des CERFA pré-remplis
  - Contrôle qualité interne du dossier
- **Statut visible**: EN COURS - ÉLABORATION DOSSIER
- **Délai cible**: 5-10 jours ouvrés selon complexité

## 3. PHASE DE FINALISATION

### 3.1 ÉTUDES TECHNIQUES SPÉCIFIQUES (si nécessaire)
- **Responsable**: Professionnel spécialisé
- **Actions**:
  - Étude RE2020 (si applicable)
  - Étude d'accessibilité ERP (si applicable)
  - Étude sécurité incendie (si applicable)
  - Intégration des résultats au dossier principal
- **Statut visible**: EN COURS - ÉTUDES TECHNIQUES
- **Délai cible**: Variable selon complexité (3-7 jours)

### 3.2 SIGNATURE ET VALIDATION FINALE
- **Responsable**: Admin ou Architecte partenaire
- **Actions**:
  - Validation technique finale du dossier
  - Signature par l'architecte (si requise)
  - Assemblage final de tous les documents
  - Préparation du dossier pour livraison
  - Deuxième facturation (solde ou acompte intermédiaire)
- **Statut visible**: VALIDATION - SIGNATURE ARCHITECTE
- **Délai cible**: 48-72h

### 3.3 LIVRAISON CLIENT
- **Responsable**: Gestionnaire ou Admin
- **Actions**:
  - Génération du dossier final au format PDF
  - Envoi sécurisé au client avec compte-rendu
  - Archivage version définitive
  - Mise à jour du statut dans le système
- **Statut visible**: LIVRÉ - À ENVOYER AU CLIENT puis LIVRÉ CLIENT
- **Délai cible**: 24h après validation finale

## 4. PHASE DE SOUMISSION ET SUIVI

### 4.1 DÉPÔT DU DOSSIER
- **Responsable**: Client ou DTAHC (selon contrat)
- **Actions**:
  - Dépôt en ligne ou en mairie du dossier
  - Enregistrement du récépissé de dépôt
  - Suivi des délais d'instruction
  - Mise à jour du statut dans le système
- **Statut visible**: SOUMIS - DÉPÔT EN LIGNE ou À DÉPOSER EN LIGNE
- **Délai cible**: 3-5 jours après livraison

### 4.2 SUIVI D'INSTRUCTION
- **Responsable**: Gestionnaire
- **Actions**:
  - Suivi du dossier auprès des services instructeurs
  - Gestion des demandes de pièces complémentaires
  - Communication avec le client
  - Mise à jour régulière du statut
- **Statut visible**: SOUMIS - EN INSTRUCTION
- **Délai cible**: Suivi hebdomadaire pendant toute la durée d'instruction

### 4.3 GESTION DES RETOURS ET FINALISATION
- **Responsable**: Gestionnaire ou Admin
- **Actions**:
  - Traitement des demandes de compléments (INCOMPLETUDE MAIRIE)
  - Gestion des modifications éventuelles
  - Enregistrement de la décision finale (ACCEPTÉ/REFUSÉ)
  - Facturation finale et clôture administrative
  - Archivage complet du dossier
- **Statut visible**: ACCEPTÉ ou REFUS DE PC/DP
- **Délai cible**: 5 jours après notification de la décision

## 5. STATUTS SPÉCIAUX

### 5.1 GESTION DES PRIORITÉS
- **Statut**: TOP URGENT
- **Critères d'attribution**:
  - Urgence administrative (délais légaux courts)
  - Demande client prioritaire
  - Enjeux financiers importants
- **Impact**: Traitement prioritaire à toutes les étapes

### 5.2 GESTION DES ANNULATIONS
- **Statut**: ANNULÉ
- **Procédure**:
  - Validation obligatoire par Admin
  - Documentation des motifs d'annulation
  - Facturation partielle selon étape atteinte
  - Archivage avec tag spécifique

## 6. INDICATEURS DE SUIVI

### 6.1 Tableau de bord de pilotage
- Nombre de dossiers par statut
- Temps moyen par étape
- Taux d'acceptation des dossiers
- Délais de traitement par type de dossier
- Alertes sur dépassements de délais critiques

### 6.2 Automatisations
- Relances automatiques clients et équipe
- Notifications de changements de statut
- Alertes échéances administratives
- Génération rapports hebdomadaire