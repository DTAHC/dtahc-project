# Architecture et flux de données pour intégrer l'API Carto

## 1. Vue d'ensemble

Cette architecture vous permettra d'intégrer les données cadastrales et réglementaires dans votre application pour le bureau d'étude DTAHC.

```
┌─────────────────┐       ┌──────────────────┐       ┌────────────────┐
│                 │       │                  │       │                │
│  Interface      │──────▶│  Middleware      │──────▶│  API Carto     │
│  utilisateur    │       │  (Votre serveur) │       │  (IGN)         │
│                 │◀──────│                  │◀──────│                │
└─────────────────┘       └──────────────────┘       └────────────────┘
                                   │
                                   │
                                   ▼
                          ┌──────────────────┐
                          │                  │
                          │  Base de données │
                          │  (Stockage)      │
                          │                  │
                          └──────────────────┘
```

## 2. Composants principaux

### 2.1 Interface utilisateur
- Formulaire de saisie pour l'adresse du client
- Affichage des plans cadastraux (échelle 1:500 et 1:3500)
- Affichage des informations cadastrales et réglementaires

### 2.2 Middleware (Votre serveur)
- Gestion des appels API
- Transformation et traitement des données
- Mise en cache des résultats pour optimiser les performances

### 2.3 API Carto (IGN)
- Source des données cadastrales et réglementaires
- Modules utilisés: Cadastre, GPU (Géoportail de l'Urbanisme)

### 2.4 Base de données
- Stockage des informations clients
- Mise en cache des résultats de l'API
- Historique des consultations

## 3. Flux de données

### 3.1 Saisie d'une nouvelle parcelle client

1. L'utilisateur saisit l'adresse ou les références cadastrales du client
2. Le système convertit l'adresse en coordonnées géographiques ou récupère les coordonnées à partir des références cadastrales
3. Le système interroge l'API Carto pour obtenir les informations cadastrales
4. Le système interroge l'API Carto/GPU pour obtenir les informations réglementaires
5. Les résultats sont stockés en base de données et affichés à l'utilisateur

### 3.2 Génération des plans cadastraux

1. À partir des informations cadastrales, le système détermine les paramètres de requête (code INSEE, section, numéro de parcelle)
2. Le système interroge l'API Carto pour obtenir les géométries de la parcelle
3. Les géométries sont utilisées pour générer des plans à l'échelle 1:500 et 1:3500
4. Les plans sont affichés à l'utilisateur et peuvent être sauvegardés en PDF

### 3.3 Récupération des informations réglementaires

1. À partir des coordonnées géographiques ou de la géométrie de la parcelle, le système interroge l'API GPU
2. Le système récupère les zonages PLU, servitudes d'utilité publique et autres réglementations
3. Les informations sont organisées de manière structurée et affichées à l'utilisateur

## 4. Considérations techniques

### 4.1 Format des données
- Entrée: Adresse ou références cadastrales (code INSEE, section, numéro)
- Format d'échange: GeoJSON (WGS84)
- Sortie: Plans cadastraux, informations parcellaires, règlements d'urbanisme

### 4.2 Limitations
- Maximum 1000 objets par requête (500 pour les communes)
- Une seule géométrie par requête
- Pagination nécessaire pour les résultats volumineux

### 4.3 Optimisations recommandées
- Mise en cache des résultats fréquemment consultés
- Traitement par lots pour les requêtes multiples
- Compression des géométries pour optimiser les temps de réponse

## 5. Sécurité et conformité

- Aucune clé API n'est requise, mais respectez les conditions d'utilisation de l'IGN
- Mentionnez la source des données (attribution IGN)
- Assurez-vous de la conformité RGPD pour les données clients
