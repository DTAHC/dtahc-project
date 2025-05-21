# Instructions de test du système de notifications

## Introduction

Ce document décrit les procédures de test pour vérifier le bon fonctionnement du système de notifications dans l'application DTAHC. Le système implémenté permet d'afficher des notifications en haut de chaque page lorsqu'une tâche est assignée à un utilisateur.

## 1. Test d'intégration dans le Header

### Objectif
Vérifier que le composant Notifications est correctement intégré dans le Header et s'affiche sur toutes les pages.

### Procédure
1. Lancez l'application en mode développement avec `npm run dev` dans le dossier `packages/frontend`
2. Accédez à la page d'accueil et vérifiez que l'icône de notification (cloche) est visible dans le Header
3. Naviguez vers différentes pages de l'application (Dashboard, Clients, etc.) et confirmez que l'icône de notification reste présente
4. Vérifiez que l'apparence respecte le design du Header (alignement, espacement, style)

### Résultat attendu
- L'icône de notification doit être visible dans le Header sur toutes les pages
- L'icône doit s'afficher correctement sans perturber la mise en page
- Si des notifications existent, un badge avec le nombre correct doit apparaître

## 2. Test de dispatch d'événements lors de l'assignation de tâches

### Objectif
Vérifier que les événements personnalisés sont correctement déclenchés lors de l'assignation de tâches.

### Procédure
1. Ouvrez la console du navigateur (F12) et saisissez le code suivant pour surveiller les événements:
   ```javascript
   window.addEventListener('taskAssigned', (e) => {
     console.log('Événement taskAssigned détecté:', e.detail);
   });
   ```
2. Accédez à la page détaillée d'un client (`/clients/client_8r81doh` ou tout autre ID client)
3. Cliquez sur le bouton "Créer une nouvelle tâche"
4. Remplissez le formulaire et assurez-vous de sélectionner un utilisateur assigné
5. Soumettez le formulaire

### Résultat attendu
- Un message dans la console du navigateur indiquant la détection de l'événement `taskAssigned`
- Les détails de l'événement doivent inclure les informations correctes:
  - La tâche créée (titre, description, etc.)
  - L'utilisateur qui a assigné la tâche
  - L'ID du client et le nom du client
  - La référence du dossier

## 3. Test d'affichage des notifications

### Objectif
Vérifier que les notifications apparaissent correctement lorsqu'une tâche est assignée.

### Procédure
1. Créez et assignez une nouvelle tâche comme dans le test précédent
2. Vérifiez que le badge du compteur de notifications est mis à jour
3. Cliquez sur l'icône de notification pour ouvrir le panneau de notifications
4. Vérifiez que la notification pour la tâche nouvellement assignée apparaît en haut de la liste

### Résultat attendu
- Le badge doit indiquer le nombre correct de notifications non lues
- La notification doit apparaître dans le panneau avec:
  - Le titre "Nouvelle tâche assignée"
  - Le message mentionnant qui a assigné la tâche
  - Les informations sur le client et le dossier concerné
  - La notification doit être marquée comme non lue (fond bleu clair)

## 4. Test des fonctions de gestion des notifications

### Objectif
Vérifier que les fonctions de gestion des notifications (marquer comme lu, supprimer) fonctionnent correctement.

### Procédure
1. Avec le panneau de notifications ouvert, cliquez sur l'icône "Marquer comme lu" (icône de coche) sur une notification
2. Fermez et rouvrez le panneau pour vérifier la persistance
3. Cliquez sur "Tout marquer comme lu" en haut du panneau
4. Cliquez sur l'icône "Supprimer" (icône X) sur une notification
5. Fermez l'application, rouvrez-la et vérifiez l'état des notifications

### Résultat attendu
- La notification marquée comme lue doit changer d'apparence (fond blanc)
- Le badge de compteur doit être mis à jour après avoir marqué une notification comme lue
- Toutes les notifications doivent être marquées comme lues après avoir cliqué sur "Tout marquer comme lu"
- La notification supprimée ne doit plus apparaître dans la liste
- L'état des notifications doit persister après avoir fermé et rouvert l'application (vérification du localStorage)

## 5. Test des notifications du navigateur

### Objectif
Vérifier que les notifications du navigateur s'affichent correctement si l'utilisateur a accordé les permissions.

### Procédure
1. Assurez-vous que les notifications du navigateur sont activées:
   - Si l'application demande la permission, acceptez-la
   - Ou vérifiez dans les paramètres du navigateur que le site a la permission d'afficher des notifications
2. Assignez une nouvelle tâche comme précédemment
3. Basculez vers un autre onglet ou minimisez le navigateur

### Résultat attendu
- Une notification du navigateur doit apparaître avec:
  - Le titre "Nouvelle tâche assignée"
  - Le message contenant les détails de la tâche et du client
  - L'icône du site (favicon)

## 6. Scénarios de test additionnels

### Test de charge
- Créez plusieurs tâches assignées (10+) et vérifiez que:
  - Les notifications s'affichent correctement avec défilement
  - La performance reste acceptable
  - Le stockage localStorage fonctionne correctement avec un grand nombre de notifications

### Test de responsive
- Vérifiez l'affichage sur différentes tailles d'écran:
  - Desktop
  - Tablet
  - Mobile
- Confirmez que le panneau de notifications s'adapte correctement et reste utilisable

### Test d'accessibilité
- Vérifiez que le composant est accessible au clavier:
  - On peut ouvrir le panneau avec Tab + Enter
  - On peut naviguer entre les notifications avec Tab
  - On peut effectuer les actions (marquer comme lu, supprimer) avec le clavier

## Rapport de bugs

Si vous rencontrez des problèmes lors des tests, veuillez les documenter avec:

1. L'étape exacte du test où le problème est survenu
2. Les étapes pour reproduire le problème
3. Le comportement attendu vs le comportement observé
4. Des captures d'écran si pertinent
5. Les informations du navigateur et du système d'exploitation