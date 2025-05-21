import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

/**
 * Service pour générer et afficher des plans cadastraux à différentes échelles
 * Ce service permet de créer des visualisations de parcelles cadastrales
 * aux échelles 1:500 et 1:3500 à partir des données de l'API Carto
 */
@Injectable()
export class CadastreMapService {
  private readonly logger = new Logger(CadastreMapService.name);
  private apiBaseUrl: string;
  private mapboxAccessToken: string;

  constructor(private configService: ConfigService) {
    this.apiBaseUrl = this.configService.get<string>('documents.cadastre.apiBaseUrl') || 'https://apicarto.ign.fr/api/cadastre';
    this.mapboxAccessToken = this.configService.get<string>('documents.cadastre.mapboxAccessToken') || '';
    this.logger.log(`Service CadastreMap initialisé avec URL: ${this.apiBaseUrl}`);
  }

  /**
   * Génère les paramètres de carte pour une parcelle à l'échelle 1:500
   * @param parcelleData Données GeoJSON de la parcelle
   * @returns Paramètres pour afficher la carte à l'échelle 1:500
   */
  generateMap500Parameters(parcelleData: any) {
    if (!parcelleData || !parcelleData.features || parcelleData.features.length === 0) {
      throw new Error('Données de parcelle invalides');
    }

    // Récupération de la géométrie de la parcelle
    const parcelle = parcelleData.features[0];
    const geometry = parcelle.geometry;
    
    // Calcul du centre et de la superficie de la parcelle
    const center = this.calculateCenter(geometry);
    const area = this.calculateArea(geometry);
    
    // Calcul du zoom pour l'échelle 1:500
    const zoom = this.calculateZoomForScale(500);
    
    // Calcul des dimensions du plan en pixels
    const dimensions = this.calculateMapDimensions(area, 500);
    
    return {
      center: center,
      zoom: zoom,
      dimensions: dimensions,
      scale: 500,
      title: `Plan cadastral 1:500 - Parcelle ${parcelle.properties.numero}`,
      geometry: geometry
    };
  }

  /**
   * Génère les paramètres de carte pour une parcelle à l'échelle 1:3500
   * @param parcelleData Données GeoJSON de la parcelle
   * @returns Paramètres pour afficher la carte à l'échelle 1:3500
   */
  generateMap3500Parameters(parcelleData: any) {
    if (!parcelleData || !parcelleData.features || parcelleData.features.length === 0) {
      throw new Error('Données de parcelle invalides');
    }

    // Récupération de la géométrie de la parcelle
    const parcelle = parcelleData.features[0];
    const geometry = parcelle.geometry;
    
    // Calcul du centre de la parcelle
    const center = this.calculateCenter(geometry);
    
    // Calcul du zoom pour l'échelle 1:3500
    const zoom = this.calculateZoomForScale(3500);
    
    // Pour l'échelle 1:3500, on va montrer la parcelle dans son contexte
    
    return {
      center: center,
      zoom: zoom,
      dimensions: { width: 800, height: 600 }, // Taille standard pour un plan d'ensemble
      scale: 3500,
      title: `Plan cadastral 1:3500 - Parcelle ${parcelle.properties.numero} et environnement`,
      geometry: geometry
    };
  }

  /**
   * Génère le HTML pour afficher une carte Leaflet avec la parcelle
   * @param mapParameters Paramètres de la carte
   * @returns Code HTML pour afficher la carte
   */
  generateLeafletMapHTML(mapParameters: any) {
    const { center, zoom, dimensions, title, geometry } = mapParameters;
    
    // Conversion de la géométrie en JSON stringifié pour l'inclure en JavaScript
    const geometryJSON = JSON.stringify(geometry);
    
    // Création du HTML pour la carte Leaflet
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <style>
    #map {
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
    }
    .map-title {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .map-footer {
      font-family: Arial, sans-serif;
      text-align: right;
      margin-top: 5px;
      font-size: 0.8em;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="map-title">${title}</div>
  <div id="map"></div>
  <div class="map-footer">Source: IGN - API Carto - DTAHC SARL</div>
  
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script>
    // Initialisation de la carte
    const map = L.map('map').setView([${center[1]}, ${center[0]}], ${zoom});
    
    // Ajout du fond de carte IGN WMTS (nécessite une clé pour certaines couches)
    L.tileLayer('https://wxs.ign.fr/decouverte/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=PLAN.IGN&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
      maxZoom: 22,
      attribution: '&copy; <a href="https://www.ign.fr/">IGN</a>'
    }).addTo(map);
    
    // Ajout de la parcelle
    const parcelleGeometry = ${geometryJSON};
    const parcelle = L.geoJSON(parcelleGeometry, {
      style: {
        color: "#FF0000",
        weight: 2,
        opacity: 1,
        fillColor: "#FF9999",
        fillOpacity: 0.3
      }
    }).addTo(map);
    
    // Ajustement de la vue pour montrer toute la parcelle
    map.fitBounds(parcelle.getBounds());
  </script>
</body>
</html>
    `;
  }

  /**
   * Génère une URL pour une image statique de la carte (via services externes comme Mapbox)
   * @param mapParameters Paramètres de la carte
   * @returns URL de l'image statique
   */
  generateStaticMapURL(mapParameters: any) {
    const { center, zoom, dimensions } = mapParameters;
    
    // Exemple avec Mapbox Static Images API (nécessite un token)
    if (!this.mapboxAccessToken) {
      this.logger.warn('Mapbox Access Token non configuré. Impossible de générer une URL d\'image statique.');
      return null;
    }
    
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${encodeURIComponent(JSON.stringify(mapParameters.geometry))})/${center[0]},${center[1]},${zoom},0/${dimensions.width}x${dimensions.height}?access_token=${this.mapboxAccessToken}`;
  }

  /**
   * Calcule le centre d'une géométrie GeoJSON
   * @param geometry Géométrie GeoJSON
   * @returns Coordonnées du centre [longitude, latitude]
   */
  calculateCenter(geometry: any): [number, number] {
    if (geometry.type === 'Point') {
      return geometry.coordinates;
    }
    
    // Pour les autres types de géométrie, on calcule le centre approximatif
    if (geometry.type === 'Polygon') {
      const coords = geometry.coordinates[0];
      let sumX = 0;
      let sumY = 0;
      
      for (let i = 0; i < coords.length; i++) {
        sumX += coords[i][0];
        sumY += coords[i][1];
      }
      
      return [sumX / coords.length, sumY / coords.length];
    }
    
    // Si type inconnu ou non géré, on renvoie [0,0]
    this.logger.warn(`Type de géométrie non pris en charge: ${geometry.type}`);
    return [0, 0];
  }

  /**
   * Calcule la superficie d'une géométrie GeoJSON
   * Note: cette implémentation est simplifiée, pour des calculs précis
   * il faudrait utiliser une bibliothèque comme turf.js
   * @param geometry Géométrie GeoJSON
   * @returns Superficie en mètres carrés (approximative)
   */
  calculateArea(geometry: any): number {
    // Implémentation simplifiée - dans un vrai service, utiliser turf.js
    if (geometry.type === 'Polygon') {
      // Pour simplifier, on utilise une valeur par défaut raisonnable
      return 1000; // 1000 m²
    }
    
    return 0;
  }

  /**
   * Calcule le niveau de zoom approprié pour une échelle donnée
   * @param scale Échelle souhaitée (ex: 500, 3500)
   * @returns Niveau de zoom pour Leaflet/Google Maps
   */
  calculateZoomForScale(scale: number): number {
    // Formule approximative pour convertir l'échelle en niveau de zoom
    // Plus la valeur de scale est petite, plus le zoom est grand
    if (scale <= 500) {
      return 19; // Zoom maximal pour les plans très détaillés (1:500)
    } else if (scale <= 1000) {
      return 18;
    } else if (scale <= 2000) {
      return 17;
    } else if (scale <= 5000) {
      return 16;
    } else {
      return 15;
    }
  }

  /**
   * Calcule les dimensions appropriées pour la carte en fonction de la superficie et de l'échelle
   * @param area Superficie en mètres carrés
   * @param scale Échelle souhaitée
   * @returns Dimensions {width, height} en pixels
   */
  calculateMapDimensions(area: number, scale: number) {
    // Calcul approximatif des dimensions en pixels basé sur la superficie et l'échelle
    // On garantit des dimensions minimales pour la lisibilité
    
    // Pour une échelle de 1:500, on veut une résolution d'environ 5cm/pixel
    const pixelSizeInMeters = scale / 10000; // Conversion de l'échelle en mètres par pixel
    
    // Calcul de la largeur et hauteur approximatives en pixels
    // On suppose que la parcelle a une forme à peu près carrée
    const sideLength = Math.sqrt(area);
    let width = Math.ceil(sideLength / pixelSizeInMeters);
    let height = Math.ceil(sideLength / pixelSizeInMeters);
    
    // Dimensions minimales pour une bonne lisibilité
    width = Math.max(width, 600);
    height = Math.max(height, 400);
    
    // Dimensions maximales raisonnables pour l'affichage
    width = Math.min(width, 1200);
    height = Math.min(height, 800);
    
    return { width, height };
  }

  /**
   * Récupère les parcelles voisines pour le plan à l'échelle 1:3500
   * Note: Cette méthode nécessiterait une bibliothèque comme turf.js
   * pour le calcul du cercle. Dans cette implémentation, on simplifie.
   * @param center Coordonnées du centre [longitude, latitude]
   * @param radius Rayon de recherche en mètres (500m par défaut)
   * @returns Promesse contenant les parcelles voisines
   */
  async getNeighboringParcels(center: [number, number], radius = 500) {
    try {
      // Dans un vrai service, utiliser turf.js pour créer un cercle
      // Ici, on simplifie avec un calcul approximatif
      
      // Approximation très simplifiée: 0.01 degré ≈ 1.11 km à l'équateur
      const degreeRadius = radius / 111000;
      
      // Création d'un cercle approximatif avec la formule simplifiée
      const simplifiedCircle = {
        type: "Polygon",
        coordinates: [[
          [center[0] + degreeRadius, center[1]],
          [center[0], center[1] + degreeRadius],
          [center[0] - degreeRadius, center[1]],
          [center[0], center[1] - degreeRadius],
          [center[0] + degreeRadius, center[1]]
        ]]
      };
      
      const url = `${this.apiBaseUrl}/parcelle?geom=${encodeURIComponent(JSON.stringify(simplifiedCircle))}&_limit=1000`;
      this.logger.log(`Requête API pour les parcelles voisines : ${url}`);
      
      const response = await axios.get(url);
      
      this.logger.log(`${response.data.totalFeatures} parcelle(s) voisine(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des parcelles voisines : ${error.message}`);
      throw error;
    }
  }
}