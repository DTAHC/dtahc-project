// urbanisme-service.js
/**
 * Service pour l'interrogation de l'API Carto module GPU (Géoportail de l'Urbanisme)
 * Ce service permet de récupérer les informations réglementaires d'urbanisme
 * applicables à une parcelle (PLU, servitudes, etc.)
 */

const axios = require('axios');

class UrbanismeService {
  constructor() {
    this.apiBaseUrl = 'https://apicarto.ign.fr/api/gpu';
  }

  /**
   * Récupère le type de document d'urbanisme applicable à un point géographique
   * @param {number} longitude - Longitude en WGS84
   * @param {number} latitude - Latitude en WGS84
   * @returns {Promise} - Promesse contenant les informations du document d'urbanisme
   */
  async getDocumentUrbanisme(longitude, latitude) {
    try {
      // Création d'un point GeoJSON
      const point = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      
      const url = `${this.apiBaseUrl}/document?geom=${encodeURIComponent(JSON.stringify(point))}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucun document d\'urbanisme trouvé à ces coordonnées');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} document(s) d'urbanisme trouvé(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du document d\'urbanisme :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les zonages d'urbanisme applicables à un point ou une géométrie
   * @param {Object} geometry - Géométrie GeoJSON (Point, Polygon...)
   * @returns {Promise} - Promesse contenant les informations de zonage
   */
  async getZonages(geometry) {
    try {
      const url = `${this.apiBaseUrl}/zonages?geom=${encodeURIComponent(JSON.stringify(geometry))}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucun zonage d\'urbanisme trouvé pour cette géométrie');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} zonage(s) d'urbanisme trouvé(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des zonages :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les servitudes d'utilité publique applicables à un point ou une géométrie
   * @param {Object} geometry - Géométrie GeoJSON (Point, Polygon...)
   * @returns {Promise} - Promesse contenant les informations de servitudes
   */
  async getServitudes(geometry) {
    try {
      // Note: Cette fonction est hypothétique car l'API Carto n'expose pas directement
      // les servitudes via le module GPU. Dans un cas réel, il faudrait utiliser
      // les services WFS du Géoportail de l'Urbanisme.
      
      // URL fictive - à remplacer par le vrai endpoint si disponible
      const url = `https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=GPU:SERVITUDE_SUP&outputFormat=json&srsName=EPSG:4326`;
      
      console.log('API de servitudes non implémentée dans API Carto. Utilisation du service WFS du GPU.');
      
      // Cette partie est à adapter selon le service réel
      /*
      const response = await axios.post(url, {
        filter: `<Filter><Intersects><PropertyName>GEOMETRY</PropertyName>${this.geometryToGML(geometry)}</Intersects></Filter>`
      });
      
      return response.data;
      */
      
      // Solution temporaire
      return { message: "Fonctionnalité non disponible - Utiliser le service WFS du GPU directement" };
    } catch (error) {
      console.error('Erreur lors de la récupération des servitudes :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les prescriptions d'urbanisme applicables à un point ou une géométrie
   * @param {Object} geometry - Géométrie GeoJSON (Point, Polygon...)
   * @returns {Promise} - Promesse contenant les informations de prescriptions
   */
  async getPrescriptions(geometry) {
    try {
      // Note: Cette fonction est hypothétique car l'API Carto n'expose pas directement
      // les prescriptions via le module GPU. Dans un cas réel, il faudrait utiliser
      // les services WFS du Géoportail de l'Urbanisme.
      
      // Solution temporaire
      return { message: "Fonctionnalité non disponible - Utiliser le service WFS du GPU directement" };
    } catch (error) {
      console.error('Erreur lors de la récupération des prescriptions :', error.message);
      throw error;
    }
  }

  /**
   * Récupère le règlement d'urbanisme applicable à un zonage
   * @param {string} idDocument - Identifiant du document d'urbanisme
   * @param {string} idZonage - Identifiant du zonage
   * @returns {Promise} - Promesse contenant le règlement
   */
  async getReglement(idDocument, idZonage) {
    try {
      // Cette fonction est hypothétique - API Carto ne fournit pas d'accès direct aux règlements
      // Il faudrait généralement utiliser le service de téléchargement du GPU
      
      const url = `https://www.geoportail-urbanisme.gouv.fr/document/${idDocument}/${idZonage}`;
      console.log(`URL du règlement (à ouvrir manuellement) : ${url}`);
      
      // Solution temporaire
      return { 
        message: "Fonctionnalité non disponible via API - Utiliser l'interface du GPU", 
        url: url 
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du règlement :', error.message);
      throw error;
    }
  }

  /**
   * Récupère toutes les informations d'urbanisme pour une parcelle
   * @param {Object} parcelleGeometry - Géométrie de la parcelle en GeoJSON
   * @returns {Promise} - Promesse contenant toutes les informations d'urbanisme
   */
  async getCompleteUrbanismeInfo(parcelleGeometry) {
    try {
      // 1. Récupération du document d'urbanisme
      const center = this.calculateCenter(parcelleGeometry);
      const documentData = await this.getDocumentUrbanisme(center[0], center[1]);
      
      // 2. Récupération des zonages
      const zonagesData = await this.getZonages(parcelleGeometry);
      
      // 3. Construction de l'objet résultat
      const result = {
        document: documentData ? this.extractDocumentInfo(documentData) : null,
        zonages: zonagesData ? this.extractZonagesInfo(zonagesData) : [],
        // Nous ne pouvons pas inclure les servitudes et prescriptions via l'API Carto
        // Ces informations devraient être récupérées via d'autres services
        servitudes: { message: "À récupérer via le service WFS du GPU" },
        prescriptions: { message: "À récupérer via le service WFS du GPU" }
      };
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations d\'urbanisme :', error.message);
      throw error;
    }
  }

  /**
   * Extrait les informations principales d'un document d'urbanisme
   * @param {Object} documentData - Données complètes du document
   * @returns {Object} - Informations principales du document
   */
  extractDocumentInfo(documentData) {
    if (!documentData || !documentData.features || documentData.features.length === 0) {
      return null;
    }
    
    const document = documentData.features[0];
    const props = document.properties;
    
    return {
      type: props.typedoc || 'Non spécifié',
      dateApprobation: props.datappro || 'Non spécifiée',
      etat: props.etat || 'Non spécifié',
      commune: props.nomcom || 'Non spécifiée',
      id: props.idurba || 'Non spécifié'
    };
  }

  /**
   * Extrait les informations principales des zonages d'urbanisme
   * @param {Object} zonagesData - Données complètes des zonages
   * @returns {Array} - Liste des informations principales des zonages
   */
  extractZonagesInfo(zonagesData) {
    if (!zonagesData || !zonagesData.features || zonagesData.features.length === 0) {
      return [];
    }
    
    return zonagesData.features.map(zonage => {
      const props = zonage.properties;
      
      return {
        libelle: props.libelle || 'Non spécifié',
        typeZone: props.typezone || 'Non spécifié',
        description: props.libelong || props.libelle || 'Non spécifiée',
        etiquette: props.etiquette || 'Non spécifiée',
        idZone: props.idzone || 'Non spécifié',
        idUrba: props.idurba || 'Non spécifié',
        urlReglement: props.urlreg || null
      };
    });
  }

  /**
   * Calcule le centre d'une géométrie GeoJSON
   * @param {Object} geometry - Géométrie GeoJSON
   * @returns {Array} - Coordonnées du centre [longitude, latitude]
   */
  calculateCenter(geometry) {
    if (geometry.type === 'Point') {
      return geometry.coordinates;
    }
    
    // Pour les autres types de géométrie, on peut calculer le centre approximatif
    // Cette implémentation est simplifiée et pourrait être améliorée
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
    return [0, 0];
  }
}

module.exports = UrbanismeService;

// Exemple d'utilisation:
/*
const CadastreService = require('./cadastre-service');
const UrbanismeService = require('./urbanisme-service');

const cadastreService = new CadastreService();
const urbanismeService = new UrbanismeService();

// Récupération des informations d'urbanisme pour une parcelle
async function getUrbanismeInfoForParcel(codeInsee, section, numero) {
  try {
    // 1. Récupération des données de la parcelle
    const parcelleData = await cadastreService.getParcelleByReference(codeInsee, section, numero);
    
    if (!parcelleData || !parcelleData.features || parcelleData.features.length === 0) {
      console.error('Parcelle non trouvée');
      return;
    }
    
    // 2. Récupération des informations d'urbanisme
    const parcelleGeometry = parcelleData.features[0].geometry;
    const urbanismeInfo = await urbanismeService.getCompleteUrbanismeInfo(parcelleGeometry);
    
    // 3. Affichage des résultats
    console.log('==== INFORMATIONS D\'URBANISME ====');
    
    if (urbanismeInfo.document) {
      console.log('DOCUMENT D\'URBANISME:');
      console.log(`Type: ${urbanismeInfo.document.type}`);
      console.log(`Approuvé le: ${urbanismeInfo.document.dateApprobation}`);
      console.log(`État: ${urbanismeInfo.document.etat}`);
      console.log(`Commune: ${urbanismeInfo.document.commune}`);
    } else {
      console.log('Aucun document d\'urbanisme trouvé');
    }
    
    console.log('\nZONAGES:');
    if (urbanismeInfo.zonages.length > 0) {
      urbanismeInfo.zonages.forEach((zonage, index) => {
        console.log(`\nZonage ${index + 1}:`);
        console.log(`Libellé: ${zonage.libelle}`);
        console.log(`Type: ${zonage.typeZone}`);
        console.log(`Description: ${zonage.description}`);
        if (zonage.urlReglement) {
          console.log(`Règlement: ${zonage.urlReglement}`);
        }
      });
    } else {
      console.log('Aucun zonage trouvé');
    }
    
    return urbanismeInfo;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations d\'urbanisme :', error.message);
  }
}

// Exemple d'appel
getUrbanismeInfoForParcel('94067', 'AB', '0123');
*/
