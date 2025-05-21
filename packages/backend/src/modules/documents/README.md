# Module Documents - API Urbanisme et Cadastre

Ce module implémente les services et contrôleurs pour accéder aux API externes de cadastre et d'urbanisme, ainsi que la gestion des documents associés.

## Structure du module

```
documents/
├── controllers/                # Contrôleurs REST
│   ├── admin-settings.controller.ts   # Gestion des configurations
│   ├── cadastre.controller.ts         # API cadastre
│   └── urbanisme.controller.ts        # API urbanisme
├── dto/                       # Data Transfer Objects
│   ├── cadastre.dto.ts        # DTOs pour les requêtes cadastre 
│   └── urbanisme.dto.ts       # DTOs pour les requêtes urbanisme
├── services/                  # Services métier
│   ├── cadastre-map.service.ts         # Génération de plans cadastraux
│   ├── cadastre.service.ts             # Accès à l'API cadastre
│   ├── external-sources.service.ts     # Gestion des configurations
│   └── urbanisme.service.ts            # Accès à l'API urbanisme
└── documents.module.ts        # Définition du module NestJS
```

## Services implémentés

### CadastreService

Service permettant d'accéder à l'API Cadastre de l'IGN pour récupérer des informations parcellaires.

Méthodes principales :
- `getParcelleByReference(codeInsee, section, numero)` : Trouve une parcelle par références cadastrales
- `getParcelleByCoordinates(longitude, latitude)` : Trouve une parcelle par coordonnées
- `getParcellesByCommune(codeInsee)` : Récupère toutes les parcelles d'une commune
- `getFeuillesCadastrales(codeInsee, section?)` : Récupère les feuilles cadastrales
- `extractParcelleInfo(parcelleData)` : Extrait les informations principales d'une parcelle

Exemple d'utilisation :
```typescript
const parcelleData = await cadastreService.getParcelleByReference('75101', 'AB', '0123');
const parcelleInfo = cadastreService.extractParcelleInfo(parcelleData);
```

### CadastreMapService

Service de génération de plans cadastraux à différentes échelles.

Méthodes principales :
- `generateMap500Parameters(parcelleData)` : Génère les paramètres pour un plan au 1:500
- `generateMap3500Parameters(parcelleData)` : Génère les paramètres pour un plan au 1:3500
- `generateLeafletMapHTML(mapParameters)` : Génère le HTML pour une carte Leaflet
- `getNeighboringParcels(center, radius)` : Récupère les parcelles voisines

Exemple d'utilisation :
```typescript
const parcelleData = await cadastreService.getParcelleByReference('75101', 'AB', '0123');
const mapParams = cadastreMapService.generateMap500Parameters(parcelleData);
const mapHTML = cadastreMapService.generateLeafletMapHTML(mapParams);
```

### UrbanismeService

Service d'accès à l'API du Géoportail de l'Urbanisme (GPU) pour récupérer les informations d'urbanisme.

Méthodes principales :
- `getDocumentUrbanisme(longitude, latitude)` : Récupère le document d'urbanisme applicable
- `getZonages(geometry)` : Récupère les zonages d'urbanisme
- `getServitudes(geometry)` : Récupère les servitudes d'utilité publique
- `getPrescriptions(geometry)` : Récupère les prescriptions d'urbanisme
- `getReglement(idDocument, idZonage)` : Récupère le règlement d'un zonage
- `getCompleteUrbanismeInfo(parcelleGeometry)` : Récupère toutes les informations d'urbanisme

Exemple d'utilisation :
```typescript
const urbanismeInfo = await urbanismeService.getCompleteUrbanismeInfo(parcelleGeometry);
```

### ExternalSourcesService

Service de gestion des configurations pour les sources de données externes.

Méthodes principales :
- `getServiceConfig(serviceName)` : Récupère la configuration d'un service
- `getAllServiceConfigs()` : Récupère toutes les configurations
- `updateServiceConfig(serviceName, config)` : Met à jour une configuration
- `setServiceStatus(serviceName, status)` : Définit le statut d'un service
- `getServiceStats(serviceName)` : Récupère les statistiques d'un service

Exemple d'utilisation :
```typescript
const cadastreConfig = externalSourcesService.getServiceConfig('cadastre');
await externalSourcesService.setServiceStatus('cadastre', ServiceStatus.ONLINE);
```

## API REST

### Cadastre API

- `POST /api/cadastre/parcelle/reference`
  - Corps: `{ codeInsee, section, numero }`
  - Retourne les informations de la parcelle

- `POST /api/cadastre/generate-map`
  - Corps: `{ codeInsee, section, numero, scale }`
  - Retourne le HTML du plan cadastral

- `GET /api/cadastre/commune/:codeInsee`
  - Retourne les informations de la commune

- `GET /api/cadastre/feuilles/:codeInsee?section=XX`
  - Retourne les feuilles cadastrales de la commune

### Urbanisme API

- `POST /api/urbanisme/document`
  - Corps: `{ longitude, latitude }`
  - Retourne le document d'urbanisme applicable

- `POST /api/urbanisme/zonages`
  - Corps: `{ geometry }`
  - Retourne les zonages d'urbanisme

- `POST /api/urbanisme/info-by-parcelle`
  - Corps: `{ codeInsee, section, numero }`
  - Retourne les informations d'urbanisme complètes pour une parcelle

### Admin Settings API

- `GET /api/admin/settings/external-sources`
  - Retourne toutes les configurations de services externes

- `POST /api/admin/settings/external-sources/:serviceName`
  - Corps: Configuration partielle du service
  - Met à jour la configuration d'un service

- `POST /api/admin/settings/external-sources/:serviceName/status`
  - Corps: `{ status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' }`
  - Met à jour le statut d'un service

- `GET /api/admin/settings/external-sources/:serviceName/stats`
  - Retourne les statistiques d'utilisation d'un service

## Configuration

Le module utilise le système de configuration de NestJS. Les valeurs par défaut sont définies dans `src/config/documents.config.ts`.

Variables d'environnement :

```env
# API Cadastre
CADASTRE_API_BASE_URL="https://apicarto.ign.fr/api/cadastre"
MAPBOX_ACCESS_TOKEN=""
CADASTRE_CACHE_DURATION_HOURS="24"
CADASTRE_MAPS_STORAGE_PATH="public/maps"

# API Urbanisme
URBANISME_API_BASE_URL="https://apicarto.ign.fr/api/gpu"
URBANISME_WFS_URL="https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wfs"
GPU_BASE_URL="https://www.geoportail-urbanisme.gouv.fr"
URBANISME_CACHE_DURATION_HOURS="48"

# CERFA
CERFA_TEMPLATES_PATH="templates/cerfa"
CERFA_OUTPUT_PATH="public/cerfa"
CERFA_AUTO_GENERATE_NOTICE="true"
```

## Tests

Un script de test est disponible pour vérifier le bon fonctionnement des APIs :

```bash
node src/test-urbanisme.js
```

## Notes

- Les services de servitudes et prescriptions utilisent le service WFS qui n'est pas directement accessible via l'API Carto. Pour une implémentation complète, il faudrait utiliser directement le service WFS du GPU.
- Le service de règlement redirige vers le site du GPU, car les règlements ne sont pas directement accessibles via l'API.
- Les plans cadastraux sont générés en HTML avec Leaflet, mais il est possible d'utiliser Mapbox pour générer des images statiques.