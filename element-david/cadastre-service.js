// cadastre-service.js
/**
 * Service pour l'interrogation de l'API Carto module cadastre
 * Ce service permet de récupérer les informations cadastrales d'une parcelle
 * à partir de différents critères (adresse, références cadastrales, coordonnées)
 */

const axios = require('axios');

class CadastreService {
  constructor() {
    this.apiBaseUrl = 'https://apicarto.ign.fr/api/cadastre';
  }

  /**
   * Récupère les informations d'une parcelle à partir de ses références cadastrales
   * @param {string} codeInsee - Code INSEE de la commune
   * @param {string} section - Section cadastrale (2 caractères)
   * @param {string} numero - Numéro de parcelle (4 caractères)
   * @returns {Promise} - Promesse contenant les informations de la parcelle
   */
  async getParcelleByReference(codeInsee, section, numero) {
    try {
      const url = `${this.apiBaseUrl}/parcelle?code_insee=${codeInsee}&section=${section}&numero=${numero}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucune parcelle trouvée avec ces références');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} parcelle(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la parcelle :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les informations d'une parcelle à partir de coordonnées géographiques
   * @param {number} longitude - Longitude en WGS84
   * @param {number} latitude - Latitude en WGS84
   * @returns {Promise} - Promesse contenant les informations de la parcelle
   */
  async getParcelleByCoordinates(longitude, latitude) {
    try {
      // Création d'un point GeoJSON
      const point = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      
      const url = `${this.apiBaseUrl}/parcelle?geom=${encodeURIComponent(JSON.stringify(point))}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucune parcelle trouvée à ces coordonnées');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} parcelle(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la parcelle :', error.message);
      throw error;
    }
  }

  /**
   * Récupère toutes les parcelles d'une commune
   * @param {string} codeInsee - Code INSEE de la commune
   * @param {number} limit - Nombre maximal de résultats (max 1000)
   * @param {number} start - Index de départ pour la pagination
   * @returns {Promise} - Promesse contenant les parcelles de la commune
   */
  async getParcellesByCommune(codeInsee, limit = 1000, start = 0) {
    try {
      const url = `${this.apiBaseUrl}/parcelle?code_insee=${codeInsee}&_limit=${limit}&_start=${start}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucune parcelle trouvée pour cette commune');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} parcelle(s) trouvée(s)`);
      
      // Si le nombre total de parcelles est supérieur à la limite,
      // on informe qu'il faudra utiliser la pagination
      if (response.data.totalFeatures > limit) {
        console.log(`Attention: ${response.data.totalFeatures} parcelles disponibles, mais seulement ${limit} récupérées. Utilisez la pagination.`);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des parcelles :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les informations d'une commune
   * @param {string} codeInsee - Code INSEE de la commune
   * @returns {Promise} - Promesse contenant les informations de la commune
   */
  async getCommune(codeInsee) {
    try {
      const url = `${this.apiBaseUrl}/commune?code_insee=${codeInsee}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucune commune trouvée avec ce code INSEE');
        return null;
      }
      
      console.log(`Commune trouvée : ${response.data.features[0].properties.nom_com}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commune :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les feuilles cadastrales d'une commune
   * @param {string} codeInsee - Code INSEE de la commune
   * @param {string} section - Section cadastrale (optionnel)
   * @returns {Promise} - Promesse contenant les feuilles cadastrales
   */
  async getFeuillesCadastrales(codeInsee, section = null) {
    try {
      let url = `${this.apiBaseUrl}/feuille?code_insee=${codeInsee}`;
      if (section) {
        url += `&section=${section}`;
      }
      
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucune feuille cadastrale trouvée');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} feuille(s) cadastrale(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des feuilles cadastrales :', error.message);
      throw error;
    }
  }

  /**
   * Récupère les localisants (numéros de voirie) d'une parcelle
   * @param {string} codeInsee - Code INSEE de la commune
   * @param {string} section - Section cadastrale
   * @param {string} numero - Numéro de parcelle
   * @returns {Promise} - Promesse contenant les localisants
   */
  async getLocalisants(codeInsee, section, numero) {
    try {
      const url = `${this.apiBaseUrl}/localisant?code_insee=${codeInsee}&section=${section}&numero=${numero}`;
      console.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        console.log('Aucun localisant trouvé pour cette parcelle');
        return null;
      }
      
      console.log(`${response.data.totalFeatures} localisant(s) trouvé(s)`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des localisants :', error.message);
      throw error;
    }
  }

  /**
   * Extrait les propriétés principales d'une parcelle pour un affichage simplifié
   * @param {Object} parcelleData - Données complètes de la parcelle
   * @returns {Object} - Propriétés principales de la parcelle
   */
  extractParcelleInfo(parcelleData) {
    if (!parcelleData || !parcelleData.features || parcelleData.features.length === 0) {
      return null;
    }
    
    const parcelle = parcelleData.features[0];
    const props = parcelle.properties;
    
    return {
      commune: props.nom_com,
      codeInsee: props.code_insee,
      section: props.section,
      numero: props.numero,
      contenance: props.contenance || 'Non disponible', // Surface en m²
      adresse: props.adresse || 'Non disponible',
      geometry: parcelle.geometry,
      bbox: parcelle.bbox || parcelleData.bbox
    };
  }
}

module.exports = CadastreService;

// Exemple d'utilisation:
/*
const cadastreService = new CadastreService();

// Exemple 1: Récupération par références cadastrales
cadastreService.getParcelleByReference('94067', 'AB', '0123')
  .then(data => {
    const parcelleInfo = cadastreService.extractParcelleInfo(data);
    console.log('Informations parcelle:', parcelleInfo);
  })
  .catch(err => console.error('Erreur:', err));

// Exemple 2: Récupération par coordonnées
cadastreService.getParcelleByCoordinates(2.41802, 48.81547)
  .then(data => {
    const parcelleInfo = cadastreService.extractParcelleInfo(data);
    console.log('Informations parcelle:', parcelleInfo);
  })
  .catch(err => console.error('Erreur:', err));
*/
