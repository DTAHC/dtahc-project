Prompt pour IA : Développement du système de gestion de dossiers d'architecture DTAHC

Objectif principal

Créer une plateforme centralisée permettant la gestion complète de création de d'autorisation de travaux, depuis la collecte des informations client jusqu'à la finalisation des dossiers administratifs prêt a être déposer en mairie en passent par la comptabilité.


Fonctionnalités clés

Plateforme web multi-utilisateurs avec hiérarchie d'accès stricte (admin, gestionnaire, comptable, professionnel)

Création de dossier par (comptable ou admin) avec des information basique nom+mail+tarif dans le system (le dossier sera exploiter par tout les outil du system de manier synchronise )  (le tarif est soit rempli manuellement soit pour les pro calculer en fonction ty pro du type de dossier et type de travaux tarif selon grille tarifaire avec option création de devis )
Récupération des information du client grâce a une fiche (info1 ) client générer dans l'outil du système puis rempli par l équipe ou envoyer automatiquement au client grâce au lien générer par l'outil et envoyer par mail au client, grâce au lien dans le mail le Client remplit un formulaire web nom, prénom, adresse,( plans, photos, etc.) ➝
Validation de la fiche (info+) client :➝ L'équipe reçoit un mail de confirmation avec le lien pour finaliser la fiche client ➝ l'outil propose un type de dossier en fonction des information client et l'equipe fait le choix final du type de dossier (permis de construire, déclaration préalable,ERP…)➝
Fiche document (fichdoc+) du dossier : L'équipe lance la récupération des document et information complémentaire(formulaires CERFA, plan cadastral, PLU et réglementation, analyse la faisabilité du projet du client) grasse au outils et des information client



Informations personnelles :
Identité complète : nom, prénom(s)
Coordonnées : adresse postale complète, téléphone(s), email(s)
Informations légales : date de naissance, lieu de naissance, nationalité
Informations projet :
Localisation précise du projet (adresse,)coche si similaire
Métriques : surface existante (m²), surface projetée après travaux (m²)
Spécifications : changement de destination (oui/non), travaux ERP (oui/non)
Nature des travaux : construction, extension, modification façade, changement destination (multisélection possible)
État actuel : travaux déjà réalisés (oui/non)
Description technique :
Descriptif détaillé narratif du projet
Caractéristiques techniques spécifiques
Contraintes particulières identifiées
Notes internes (visibles uniquement par l'équipe)

Architecture des fichiers et stockage
Arborescence standardisée obligatoire pour chaque client :
/année/Clients/Nom_Client/
│
├── fiche_client/             
│   ├── fiche_Nom_Client.pdf    ← Version PDF finalisée de la fiche client
│   └── fiche_Nom_Client.json   ← Données structurées pour exploitation programmatique
│
├── cerfa/(tout les cerfa selon projet)               
│   ├── cerfa_13703_prerempl.pdf  ← Formulaire CERFA pré-rempli (déclaration travaux)
│   ├── cerfa_13406_prerempl.pdf  ← Formulaire CERFA pré-rempli (permis de construire)
│   └── annexes/                  ← Dossier pour documents annexes CERFA
│
├── documents/                
│   ├── acte_propriete.pdf       ← Documents juridiques fournis par le client
│   ├── plans_existants/         ← Sous-dossier pour plans actuels
│   ├── photos/                  ← Sous-dossier pour photographies du site
│   └── autres/                  ← Documents complémentaires
│
├── cadastre/                 
│   ├── plan_cadastral_1_500.pdf   ← Plan cadastral échelle 1/500
│   ├── plan_situation_1_3000.pdf  ← Plan de situation échelle 1/3000
│   └── infos_parcelle.json        ← Données parcellaires structurées
│
├── plu/                      
│   ├── reglement_zone.pdf        ← Document réglementaire de la zone
│   ├── prescriptions.pdf         ← Prescriptions d'urbanisme applicables
│   └── metadata_plu.json         ← Métadonnées et extraits clés en format exploitable
│
├── faisabilite/              
│   ├── rapport_analyse.pdf       ← Rapport d'analyse de faisabilité généré
│   ├── criteres_evaluation.json  ← Critères utilisés pour l'évaluation
│   └── recommandations.md        ← Recommandations techniques
│
├── comptabilite/
│   ├── devis_Nom_Client.pdf      ← Documents financiers
│   ├── factures/                 ← Sous-dossier factures
│   └── reglements/               ← Sous-dossier règlements
│
└── divers/                   
    ├── correspondance/           ← Échanges avec le client
    ├── notes_internes.md         ← Notes pour l'équipe
    └── historique_actions.json   ← Journal chronologique des actions


1. Initialisation du processus 

Authentification 

Connexion sécurisée au tableau de bord administratif
Vérification des permissions appropriées
Accès à l'interface de création client
Création fiche client initiale 

Saisie des informations minimales (nom, prénom, email, tarif selon grille tarifaire ou manuel avec option création de devis)
Option d'import depuis CRM/fichier existant
Attribution identifiant unique dossier (format: ANNÉE-NUMÉRO)
Mise à jour tableau de bord, liste de dossier, page comptabilité etc.. synchronisation directe avec nouveau dossier
1.2 fiche client (info1 ) deux possibilité 
Remplissage de la fiche par l équipe interner ou 
Génération et envoi lien formulaire par mail au client de manière automatique 

Création automatique lien sécurisé unique avec expiration (172h configurable)
Personnalisation du message email d'accompagnement
Envoi programmable avec rappels automatiques (J+3, J+8 si non complété)
Tracking réception/ouverture email et accès formulaire

2. Processus de collecte d'informations client (info1 )

Réception email par le client

Email professionnel avec logo DTAHC et branding autorisations.fr
Lien sécurisé avec token authentification unique
Instructions claires sur la procédure à suivre
Accès au formulaire web intelligent

Interface responsive multiplateforme
Authentification légère via token email
Expérience utilisateur intuitive avec progression par étapes
Saisie progressive structurée

Étape 1: Informations personnelles (identité, contact)
Étape 2: Informations sur le bien immobilier (adresse,)
Étape 3: Nature du projet (surfaces, destination, description)
Étape 4: Documents complémentaires (upload pièces justificatives)
Étape 5: Validation et confirmation + (rgpd)
Fonctionnalités avancées du formulaire

Auto-sauvegarde en temps réel
Validation instantanée des champs (format, cohérence)
Assistants contextuels pour champs techniques
Upload multiple documents avec prévisualisation
Barre de progression globale et par section
Finalisation et soumission

Récapitulatif complet des informations saisies
Possibilité de correction avant soumission finale
Signature électronique (optionnelle)
Confirmation visuelle de soumission pour le client

3. Traitement automatisé post-soumission 

Création structure dossier

Génération instantanée de l'arborescence complète
Création des sous-dossiers normalisés
Préparation environnement pour documents automatisés
Enregistrement des données

Stockage dual: base de données (exploitation) et (archive)
Génération fiche client standardisée
Classement automatique des documents uploadés
Indexation pour recherche ultérieure (dans le dossier du client)
Déclenchement workflow notifications

Email confirmation au client avec récapitulatif
Alerte interne à l'équipe DTAHC (email + notification système)
Mise à jour de toute les page avec nouveau dossier
Indicateur visuel "Nouveau dossier à traiter"

4. Phase de validation administrative (info+) (tarif visible uniquement pour comptable et admin)

Accès au dossier par l'équipe

Notification dans le tableau de bord (pastille colorée)pour l envoie du mail , pour les fiche rempli 
Accès direct via lien dans email de notification
Vue synthétique des informations client
Vérification et enrichissement de la fiche (info+)
Contrôle qualité des informations fournies

Ajout informations internes (classification si besoin, priorité)
Upload documents complémentaires si nécessaire
Analyse préliminaire automatique 

Calcul automatique type de dossier requis (permis de construire, déclaration préalable,ERP…) selon algorithme selon information client (surface existante, surface future, type de travaux etc…)
Affichage recommandation avec justification détaillée 

Suggestion documents complémentaires requis

Validation du type de dossier proposé ou modification
Paramétrage options spécifiques ( RE2020, etc.)
Note message utile ou information de l'equip  (Analyse de l équipe)
Enregistrement décision avec horodatage et utilisateur 
Validation (Mise a jour général + notification dans le système)



5. Récupération automatisée des documents réglementaires (fichdoc+)

Lancement processus d'enrichissement documentaire

Interface avec boutons dédiés par type de document
Option lancement global ou sélectif selon ordre de lancement 
Indicateurs visuels de progression
(Mise a jour général + notification dans le système)

	3	Récupération automatisée des documents réglementaires (fichdoc+)
	◦	Lancement processus d'enrichissement documentaire
	◦	Interface avec boutons dédiés par type de document
	◦	Option lancement global ou sélectif
	◦	Indicateurs visuels de progression
2.          Récupération Plan Cadastral (fiche client doit être rempli pour lancer cette étape )
	◦	Interrogation API Cadastre avec paramètres adresse       
	◦	Récupération plan parcellaire échelle 1/500
	◦	Génération plan situation échelle 1/3000
	◦	Extraction métadonnées parcellaires (références, contenance)
	◦	Stockage documents et données dans sous-dossier cadastre/
3.          Acquisition réglementation PLU (fiche client , le cadastre, doit être validé  pour lancer cette étape)
	◦	Détermination zone PLU applicable via coordonnées/adresse ET numéro de parcelle
	◦	Récupération règlement complet de la zone
	◦	Extraction prescriptions particulières applicables
	◦	Identification contraintes spécifiques (ABF, PPRI, etc.)
	◦	Stockage documents et données dans sous-dossier plu/
4         Analyse de faisabilité automatisée     (fiche client, le cadastre,la réglementation PLU  doit être validée pour lancer cette étape)
	◦	Traitement algorithmique des contraintes identifiées
	◦	Confrontation projet client aux règles d'urbanisme
	◦	Identification points de conformité/non-conformité
	◦	Génération rapport synthétique avec recommandations
	◦	Stockage rapport et données dans sous-dossier faisabilite/
5.         Génération CERFA pré-rempli    (fiche client ,le cadastre doit être valider pour lancer cette étape)
	◦	Sélection automatique template CERFA approprié
	◦	Mapping intelligent données client vers champs formulaire
	◦	Remplissage via PDFtk avec formatage normalisé
	◦	Stockage dans sous-dossier cerfa/ avec nomenclature standard
	◦	Option génération documents annexes requis (notice, etc.)
(Mise a jour général + notification dans le système)


6. Suivi avancé et notification

Mise à jour statut dossier

Changement automatique statut selon étape atteinte
Horodatage précis de chaque transition d'état
Traçabilité des intervenants par action
Système visuel de notification

Pastilles colorées dans tableau de bord (vert/orange/rouge)
Indicateurs numériques regroupés par statut
Alertes pour actions requises ou retards
Communications automatisées

Notifications email aux intervenants concernés
Messages internes pour équipe DTAHC
Possibilité communications client sur avancement
Suivi temporel et relances (mail type devis, 1er étape dossier avan projet APS, demande de solde , 2er étape dossier projet permis de construire ou déclaration de travaux…, facture, relance…)

Détection automatique dossiers sans activité (seuil configurable 3 semaine, 5 semaine)
Système de relance programmée (interne et client)
Indicateurs de performance (temps moyen traitement)

Phase 4 : Logiques de déroulement à garder en tête

Détermination algorithmique du type de dossier

Système expert hiérarchisé suivant une logique précise :

Vérification préliminaire :

Nature ERP (Établissement Recevant du Public) ?
Changement de destination impliqué ?
Modification structurelle ou façade prévue ?
Analyse dimensionnelle :

Surface création/extension 
Surface existante 
Surface totale projetée après travaux
Vérification seuils réglementaires (5m², 20m², 40m², 150m²)
Application règles décisionnelles :

Déclaration Préalable (DP) comme cas par défaut, sauf exception
DP maintenue si :
Surface nouvelle entre 5 et 20m² (tous cas)
Surface nouvelle entre 20 et 40m² ET zone PLU ET total <150m²
Surface existante >150m² avec extension <40m²
ERP sans modification structurelle ou façade
Changement destination sans travaux structurels
Permis de Construire (PC) requis si :
Surface créée >40m² (seuil absolu)
Surface totale dépasse 150m² à cause des travaux
ERP avec modification structure/façade
Changement destination avec travaux structurels
Exigences additionnelles :

Signature architecte obligatoire si :
Création Surface totale >150m² ET création >20m² + Surface totale >150m²
Étude RE2020 obligatoire si :
Permis de construire requis (tous cas)
Dossier spécifique ERP si :
Établissement concerné reçoit du public
Pondérations contextuelles :

Localisation en zone ABF (Architecte Bâtiments France)
Secteur sauvegardé ou protection patrimoniale
Zone à risque (PPRI, PPRN, etc.)

Gestion des documents et sécurité

Standardisation documentaire :

Formats normalisés : PDF/A pour archivage long terme
Résolution minimale imposée pour plans et photos
Métadonnées enrichies (auteur, date, version, tags)
Signatures numériques pour documents officiels
Convention nommage stricte :

Format: TYPE_DOCUMENT_NOM-CLIENT_DATE_VERSION
Exemple: CERFA_13703_DUPONT-JEAN_20250418_V1
Métacaractères interdits ou échappés
Casse normalisée (majuscules pour types)
Gestion versions sophistiquée :

Versioning incrémental automatique
Conservation historique complet
Différentiel visuel entre versions
Journal modifications avec auteur et motif
Sécurité multicouche :

Cloisonnement strict par rôle utilisateur
Actions permises documentées et auditées
Interdiction suppression (archivage logique uniquement)
Chiffrement documents sensibles
Watermarking dynamique pour exports
Politique sauvegarde :

Backup quotidien incrémental
Backup hebdomadaire complet
Chiffrement sauvegardes
Test restauration périodique

Interface utilisateur et expérience

Tableau de bord principal contextuel :

Adaptation dynamique selon profil connecté
Widgets configurables selon préférences
Vue consolidée ou détaillée selon contexte
Mode focus sur dossiers prioritaires/récents
Système indicateurs visuels sophistiqué :

Codification couleur standardisée :
Vert : conforme/complet
Orange : attention requise/incomplet
Rouge : action urgente/bloquant
Bleu : nouveau/non traité
Badges numériques pour quantification
Icônes sémantiques intuitives
Tendances temporelles visualisées
Navigation et recherche avancées :

Filtres multicritères combinables sur chaque page 
 Gestion des clients Gérez les clients et leurs informations (Année ,Mois) (mail envoyer ou pa , fiche client rempli ou pas, )(type de client pro, particulier)
Tableau de bord général Filtres multicritères combinables (par mois) (type de client pro, particulier) (Statut,Type de dossier,Priorité) (urgente attente client,A déposer, incomplet)
Gestion des documents onglet Génération des formulaires, cadastre, plu, faisabilité… administratifs recherche de client par filtre(Année ,Mois) (mail envoyer ou pa , fiche client rempli ou pas, )(type de client pro, particulier)
comptabilité onglet devis, Paiement, facture client particulier, facture client pro ,statistique avec filtre (Année ,Mois) (mail envoyer ou pa , fiche client rempli ou pas, )(type de client pro, particulier)
Recherche plein texte sur tous documents
Historique recherches personnalisé
Tags et métadonnées exploitables
Ergonomie des actions principales :

1. Types de dossiers
Type de dossier
DP
DP+MUR
DP ITE
DP FENETRE
DP piscine
DP solair
PC+RT
PC+RT+SIGNATURE
PC MODIF
ERP
FENETRE + ITE
PLAN DE MASSE
PAC
Réalisation 3D
2. Étapes
Étape
INITIAL
ATTENTE PIÈCE
ÉTUDE APS
DOSSIER COMPLET
RE 2020
SIGNATURE ARCHI
3. Statuts
Statut
LIVRÉ CLIENT
DÉPÔT EN LIGNE
TOP URGENT
ANNULÉ
INCOMPLETUDE MAIRIE
REFUS DE PC/DP
À DÉPOSER EN LIGNE
À ENVOYER AU CLIENT
4. Clients pro (professionnels)

GROUPE APB

ARCADIA
COMBLE DF
ECA
LT ARTISAN
SODERBAT
COMBLESPACE
PARTICULIER
MDT ANTONY
MDT C.ROBERT
MDT YERRES
MDT ST-GEN
B3C
TERRASSE ET JAR
RENOKEA
GROUPE APB
PUREWATT
S.AUGUSTO
3D TRAVAUX
BATI PRESTO
CPHF
MDT FONT


Fonctionnalités principales
	1	Édition en ligne (inline)
	•	Modification des champs directement dans le tableau
	•	Enregistrement automatique  (sans rechargement de page)
	•	Types de champs éditables :
	•	Sélections (type de dossier, étape, statut )
	•	Champs texte (commentaires)
	1	Système de notification
	•	Confirmation des modifications réussies
	•	Affichage des erreurs éventuelles
	1	Alerte visuelle sur délais (devient vert quand le dossier est réaliser et livré)
	•	Fond orange pour les dossiers en attente depuis plus de 10 jours(devient vert quand le dossier est réaliser et livré)
	•	Fond rouge pour les dossiers en attente depuis plus de 20 jours (devient vert quand le dossier est réaliser et livré)


