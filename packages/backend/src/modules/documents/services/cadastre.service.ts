import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

/**
 * Service pour l'interrogation de l'API Carto module cadastre
 * Ce service permet de récupérer les informations cadastrales d'une parcelle
 * à partir de différents critères (adresse, références cadastrales, coordonnées)
 */
@Injectable()
export class CadastreService {
  private readonly logger = new Logger(CadastreService.name);
  private apiBaseUrl: string;

  constructor(private configService: ConfigService) {
    // Récupération de l'URL de l'API depuis la configuration
    this.apiBaseUrl = this.configService.get<string>('documents.cadastre.apiBaseUrl') || 'https://apicarto.ign.fr/api/cadastre';
    this.logger.log(`Service Cadastre initialisé avec URL: ${this.apiBaseUrl}`);
  }

  /**
   * Récupère les informations d'une parcelle à partir de ses références cadastrales
   * @param codeInsee Code INSEE de la commune
   * @param section Section cadastrale (2 caractères)
   * @param numero Numéro de parcelle (4 caractères)
   * @returns Promesse contenant les informations de la parcelle
   */
  async getParcelleByReference(codeInsee: string, section: string, numero: string) {
    try {
      const url = `${this.apiBaseUrl}/parcelle?code_insee=${codeInsee}&section=${section}&numero=${numero}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucune parcelle trouvée avec ces références');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} parcelle(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de la parcelle : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les informations d'une parcelle à partir de coordonnées géographiques
   * @param longitude Longitude en WGS84
   * @param latitude Latitude en WGS84
   * @returns Promesse contenant les informations de la parcelle
   */
  async getParcelleByCoordinates(longitude: number, latitude: number) {
    try {
      // Création d'un point GeoJSON
      const point = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      
      const url = `${this.apiBaseUrl}/parcelle?geom=${encodeURIComponent(JSON.stringify(point))}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucune parcelle trouvée à ces coordonnées');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} parcelle(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de la parcelle : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère toutes les parcelles d'une commune
   * @param codeInsee Code INSEE de la commune
   * @param limit Nombre maximal de résultats (max 1000)
   * @param start Index de départ pour la pagination
   * @returns Promesse contenant les parcelles de la commune
   */
  async getParcellesByCommune(codeInsee: string, limit = 1000, start = 0) {
    try {
      const url = `${this.apiBaseUrl}/parcelle?code_insee=${codeInsee}&_limit=${limit}&_start=${start}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucune parcelle trouvée pour cette commune');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} parcelle(s) trouvée(s)`);
      
      // Si le nombre total de parcelles est supérieur à la limite,
      // on informe qu'il faudra utiliser la pagination
      if (response.data.totalFeatures > limit) {
        this.logger.log(`Attention: ${response.data.totalFeatures} parcelles disponibles, mais seulement ${limit} récupérées. Utilisez la pagination.`);
      }
      
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des parcelles : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les informations d'une commune
   * @param codeInsee Code INSEE de la commune
   * @returns Promesse contenant les informations de la commune
   */
  async getCommune(codeInsee: string) {
    try {
      const url = `${this.apiBaseUrl}/commune?code_insee=${codeInsee}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucune commune trouvée avec ce code INSEE');
        return null;
      }
      
      this.logger.log(`Commune trouvée : ${response.data.features[0].properties.nom_com}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération de la commune : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les feuilles cadastrales d'une commune
   * @param codeInsee Code INSEE de la commune
   * @param section Section cadastrale (optionnel)
   * @returns Promesse contenant les feuilles cadastrales
   */
  async getFeuillesCadastrales(codeInsee: string, section?: string) {
    try {
      let url = `${this.apiBaseUrl}/feuille?code_insee=${codeInsee}`;
      if (section) {
        url += `&section=${section}`;
      }
      
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucune feuille cadastrale trouvée');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} feuille(s) cadastrale(s) trouvée(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des feuilles cadastrales : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les localisants (numéros de voirie) d'une parcelle
   * @param codeInsee Code INSEE de la commune
   * @param section Section cadastrale
   * @param numero Numéro de parcelle
   * @returns Promesse contenant les localisants
   */
  async getLocalisants(codeInsee: string, section: string, numero: string) {
    try {
      const url = `${this.apiBaseUrl}/localisant?code_insee=${codeInsee}&section=${section}&numero=${numero}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucun localisant trouvé pour cette parcelle');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} localisant(s) trouvé(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des localisants : ${error.message}`);
      throw error;
    }
  }

  /**
   * Extrait les propriétés principales d'une parcelle pour un affichage simplifié
   * @param parcelleData Données complètes de la parcelle
   * @returns Propriétés principales de la parcelle
   */
  extractParcelleInfo(parcelleData: any) {
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