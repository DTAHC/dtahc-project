# Système de Notifications

Cette documentation explique le système de notifications implémenté pour l'application DTAHC, qui permet d'afficher des alertes en haut de chaque page lorsqu'une tâche est assignée à un utilisateur.

## Composants Principaux

### 1. Notifications.tsx

`/components/layout/Notifications.tsx` est le composant principal qui :
- Affiche l'icône de notification avec un badge de compteur
- Gère le panneau déroulant des notifications
- Stocke les notifications dans le localStorage
- Écoute les événements d'assignation de tâches
- Prend en charge les notifications du navigateur

### 2. Header.tsx

`/components/layout/Header.tsx` intègre le composant Notifications dans l'en-tête de l'application, assurant qu'il est visible sur toutes les pages.

### 3. TaskForm.tsx

`/components/tasks/TaskForm.tsx` déclenche l'événement personnalisé `taskAssigned` lorsqu'une tâche est assignée à un utilisateur.

## Fonctionnalités

### Stockage et Persistance

Les notifications sont stockées dans le localStorage du navigateur sous la clé `dtahc_notifications`. Cela permet de :
- Conserver les notifications même après rechargement de la page
- Maintenir l'état (lu/non lu) des notifications
- Accéder aux notifications hors ligne

### Événements Personnalisés

Le système utilise des événements personnalisés pour communiquer entre les composants :

```javascript
// Déclenchement d'un événement d'assignation de tâche
const event = new CustomEvent('taskAssigned', {
  detail: {
    task: { ... },  // Détails de la tâche
    assignedBy: "Admin",  // Utilisateur qui a assigné la tâche
    clientName: "...",  // Nom du client concerné
    clientId: "...",  // ID du client
    dossierRef: "..."  // Référence du dossier
  }
});
window.dispatchEvent(event);
```

### Notifications du Navigateur

Le système utilise l'API Notifications du navigateur pour afficher des alertes système même lorsque l'utilisateur n'est pas actif sur l'application.

```javascript
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Nouvelle tâche assignée', {
    body: `${assignedBy} vous a assigné une tâche: "${task.title}" pour le client ${clientName}`,
    icon: '/favicon.ico',
  });
}
```

## Structure des Données

Chaque notification a la structure suivante :

```typescript
interface Notification {
  id: string;         // Identifiant unique
  title: string;      // Titre de la notification
  message: string;    // Contenu détaillé
  type: 'task' | 'action' | 'system' | 'info';  // Type de notification
  status: 'unread' | 'read';  // État de lecture
  createdAt: string;  // Date de création (ISO string)
  link?: string;      // Lien optionnel vers la page concernée
  clientId?: string;  // ID du client concerné
  taskId?: string;    // ID de la tâche concernée
  dossierRef?: string; // Référence du dossier
  fromUser?: string;  // Utilisateur qui a déclenché la notification
}
```

## Intégration

Le composant de notification est intégré dans le Header de l'application et est donc présent sur toutes les pages, conformément aux exigences :

> "quan une tache est atribuer a une personne je pens que la notification devrai apparetre en hau de chaque page on doi savoir qui nous a atribuer la tache et quel dossier est concerner"

## Comment Tester

Pour tester le système de notifications, suivez les instructions détaillées dans le fichier `notification-test-instructions.md`.

## Évolutions Futures

Possibilités d'amélioration du système de notifications :

1. **Backend de notifications** - Stocker les notifications sur le serveur pour synchronisation entre appareils
2. **Notifications en temps réel** - Utiliser WebSockets pour des notifications instantanées
3. **Filtres et catégories** - Permettre de filtrer les notifications par type ou importance
4. **Paramètres utilisateur** - Permettre aux utilisateurs de configurer quelles notifications ils souhaitent recevoir
5. **Notifications par email** - Envoyer également les notifications importantes par email