// cadastre-map.js
/**
 * Service pour générer et afficher des plans cadastraux à différentes échelles
 * Ce service permet de créer des visualisations de parcelles cadastrales
 * aux échelles 1:500 et 1:3500 à partir des données de l'API Carto
 */

const axios = require('axios');
const turf = require('@turf/turf');

class CadastreMapService {
  constructor() {
    this.apiBaseUrl = 'https://apicarto.ign.fr/api/cadastre';
    this.mapboxAccessToken = 'VOTRE_TOKEN_MAPBOX'; // À remplacer par votre token Mapbox si utilisé
  }

  /**
   * Génère les paramètres de carte pour une parcelle à l'échelle 1:500
   * @param {Object} parcelleData - Données GeoJSON de la parcelle
   * @returns {Object} - Paramètres pour afficher la carte à l'échelle 1:500
   */
  generateMap500Parameters(parcelleData) {
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
   * @param {Object} parcelleData - Données GeoJSON de la parcelle
   * @returns {Object} - Paramètres pour afficher la carte à l'échelle 1:3500
   */
  generateMap3500Parameters(parcelleData) {
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
    // On récupère donc aussi les parcelles voisines si besoin
    
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
   * @param {Object} mapParameters - Paramètres de la carte
   * @returns {string} - Code HTML pour afficher la carte
   */
  generateLeafletMapHTML(mapParameters) {
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
   * Télécharge les parcelles voisines pour le plan à l'échelle 1:3500
   * @param {Array} center - Coordonnées du centre [longitude, latitude]
   * @param {number} radius - Rayon de recherche en mètres (500m par défaut)
   * @returns {Promise} - Promesse contenant les parcelles voisines
   */
  async getNeighboringParcels(center, radius = 500) {
    try {
      // Création d'un cercle pour la requête
      const circle = turf.circle(center, radius / 1000);
      
      const url = `${this.apiBaseUrl}/parcelle?geom=${encodeURIComponent(JSON.stringify(circle.geometry))}&_limit=1000`;
      console.log(`Requête API pour les parcelles voisines : ${url}`);
      
      const response = await axios.get(url);
      
      console.log(`${response.data.totalFeatures} parcelle(s) voisine(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des parcelles voisines :', error.message);
      throw error;
    }
  }

  /**
   * Génère une URL pour une image statique de la carte (via services externes comme Mapbox)
   * @param {Object} mapParameters - Paramètres de la carte
   * @returns {string} - URL de l'image statique
   */
  generateStaticMapURL(mapParameters) {
    const { center, zoom, dimensions } = mapParameters;
    
    // Exemple avec Mapbox Static Images API (nécessite un token)
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(${encodeURIComponent(JSON.stringify(mapParameters.geometry))})/${center[0]},${center[1]},${zoom},0/${dimensions.width}x${dimensions.height}?access_token=${this.mapboxAccessToken}`;
    
    // Alternativement, on pourrait générer l'image côté serveur avec une bibliothèque comme node-canvas et leaflet
  }

  /**
   * Calcule le centre d'une géométrie GeoJSON
   * @param {Object} geometry - Géométrie GeoJSON
   * @returns {Array} - Coordonnées du centre [longitude, latitude]
   */
  calculateCenter(geometry) {
    try {
      const feature = turf.feature(geometry);
      const center = turf.center(feature);
      return center.geometry.coordinates;
    } catch (error) {
      console.error('Erreur lors du calcul du centre :', error.message);
      // Valeur par défaut en cas d'erreur
      return [0, 0];
    }
  }

  /**
   * Calcule la superficie d'une géométrie GeoJSON
   * @param {Object} geometry - Géométrie GeoJSON
   * @returns {number} - Superficie en mètres carrés
   */
  calculateArea(geometry) {
    try {
      const feature = turf.feature(geometry);
      return turf.area(feature);
    } catch (error) {
      console.error('Erreur lors du calcul de la superficie :', error.message);
      return 0;
    }
  }

  /**
   * Calcule le niveau de zoom approprié pour une échelle donnée
   * @param {number} scale - Échelle souhaitée (ex: 500, 3500)
   * @returns {number} - Niveau de zoom pour Leaflet/Google Maps
   */
  calculateZoomForScale(scale) {
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
   * @param {number} area - Superficie en mètres carrés
   * @param {number} scale - Échelle souhaitée
   * @returns {Object} - Dimensions {width, height} en pixels
   */
  calculateMapDimensions(area, scale) {
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
}

module.exports = CadastreMapService;

// Exemple d'utilisation:
/*
const CadastreService = require('./cadastre-service');
const CadastreMapService = require('./cadastre-map');
const fs = require('fs');

const cadastreService = new CadastreService();
const cadastreMapService = new CadastreMapService();

// Récupération des données d'une parcelle et génération de cartes
async function generateMapsForParcel(codeInsee, section, numero) {
  try {
    // Récupération des données de la parcelle
    const parcelleData = await cadastreService.getParcelleByReference(codeInsee, section, numero);
    
    if (!parcelleData) {
      console.error('Parcelle non trouvée');
      return;
    }
    
    // Génération des paramètres pour les cartes
    const map500Params = cadastreMapService.generateMap500Parameters(parcelleData);
    const map3500Params = cadastreMapService.generateMap3500Parameters(parcelleData);
    
    // Génération des HTML pour les cartes
    const map500HTML = cadastreMapService.generateLeafletMapHTML(map500Params);
    const map3500HTML = cadastreMapService.generateLeafletMapHTML(map3500Params);
    
    // Écriture des fichiers HTML
    fs.writeFileSync(`plan_500_${codeInsee}_${section}_${numero}.html`, map500HTML);
    fs.writeFileSync(`plan_3500_${codeInsee}_${section}_${numero}.html`, map3500HTML);
    
    console.log('Plans générés avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération des plans :', error.message);
  }
}

// Exemple d'appel
generateMapsForParcel('94067', 'AB', '0123');
*/
