import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

/**
 * Service pour l'interrogation de l'API Carto module GPU (Géoportail de l'Urbanisme)
 * Ce service permet de récupérer les informations réglementaires d'urbanisme
 * applicables à une parcelle (PLU, servitudes, etc.)
 */
@Injectable()
export class UrbanismeService {
  private readonly logger = new Logger(UrbanismeService.name);
  private apiBaseUrl: string;

  constructor(private configService: ConfigService) {
    // Récupération de l'URL de l'API depuis la configuration
    this.apiBaseUrl = this.configService.get<string>('documents.urbanisme.apiBaseUrl') || 'https://apicarto.ign.fr/api/gpu';
    this.logger.log(`Service Urbanisme initialisé avec URL: ${this.apiBaseUrl}`);
  }

  /**
   * Récupère le type de document d'urbanisme applicable à un point géographique
   * @param longitude Longitude en WGS84
   * @param latitude Latitude en WGS84
   * @returns Promesse contenant les informations du document d'urbanisme
   */
  async getDocumentUrbanisme(longitude: number, latitude: number) {
    try {
      // Création d'un point GeoJSON
      const point = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      
      const url = `${this.apiBaseUrl}/document?geom=${encodeURIComponent(JSON.stringify(point))}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucun document d\'urbanisme trouvé à ces coordonnées');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} document(s) d'urbanisme trouvé(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du document d'urbanisme : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les zonages d'urbanisme applicables à un point ou une géométrie
   * @param geometry Géométrie GeoJSON (Point, Polygon...)
   * @returns Promesse contenant les informations de zonage
   */
  async getZonages(geometry: any) {
    try {
      const url = `${this.apiBaseUrl}/zonages?geom=${encodeURIComponent(JSON.stringify(geometry))}`;
      this.logger.log(`Requête API : ${url}`);
      
      const response = await axios.get(url);
      
      // Vérification si des résultats ont été trouvés
      if (response.data.totalFeatures === 0) {
        this.logger.log('Aucun zonage d\'urbanisme trouvé pour cette géométrie');
        return null;
      }
      
      this.logger.log(`${response.data.totalFeatures} zonage(s) d'urbanisme trouvé(s)`);
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des zonages : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les servitudes d'utilité publique applicables à un point ou une géométrie
   * @param geometry Géométrie GeoJSON (Point, Polygon...)
   * @returns Promesse contenant les informations de servitudes
   */
  async getServitudes(geometry: any) {
    try {
      // Note: Cette fonction est hypothétique car l'API Carto n'expose pas directement
      // les servitudes via le module GPU. Dans un cas réel, il faudrait utiliser
      // les services WFS du Géoportail de l'Urbanisme.
      
      // URL de service WFS - à configurer selon les besoins
      const wfsUrl = this.configService.get<string>('urbanisme.wfsUrl') || 
        'https://wxs-gpu.mongeoportail.ign.fr/externe/i9ytmrb6tgtq5yfek781ntqi/wfs';
      
      this.logger.log('API de servitudes non implémentée dans API Carto. Utilisation du service WFS du GPU.');
      
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
      this.logger.error(`Erreur lors de la récupération des servitudes : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère les prescriptions d'urbanisme applicables à un point ou une géométrie
   * @param geometry Géométrie GeoJSON (Point, Polygon...)
   * @returns Promesse contenant les informations de prescriptions
   */
  async getPrescriptions(geometry: any) {
    try {
      // Note: Cette fonction est hypothétique car l'API Carto n'expose pas directement
      // les prescriptions via le module GPU. Dans un cas réel, il faudrait utiliser
      // les services WFS du Géoportail de l'Urbanisme.
      
      // Solution temporaire
      return { message: "Fonctionnalité non disponible - Utiliser le service WFS du GPU directement" };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des prescriptions : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère le règlement d'urbanisme applicable à un zonage
   * @param idDocument Identifiant du document d'urbanisme
   * @param idZonage Identifiant du zonage
   * @returns Promesse contenant le règlement
   */
  async getReglement(idDocument: string, idZonage: string) {
    try {
      // Cette fonction est hypothétique - API Carto ne fournit pas d'accès direct aux règlements
      // Il faudrait généralement utiliser le service de téléchargement du GPU
      
      const gpuBaseUrl = this.configService.get<string>('urbanisme.gpuBaseUrl') || 
        'https://www.geoportail-urbanisme.gouv.fr';
      
      const url = `${gpuBaseUrl}/document/${idDocument}/${idZonage}`;
      this.logger.log(`URL du règlement (à ouvrir manuellement) : ${url}`);
      
      // Solution temporaire
      return { 
        message: "Fonctionnalité non disponible via API - Utiliser l'interface du GPU", 
        url: url 
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du règlement : ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère toutes les informations d'urbanisme pour une parcelle
   * @param parcelleGeometry Géométrie de la parcelle en GeoJSON
   * @returns Promesse contenant toutes les informations d'urbanisme
   */
  async getCompleteUrbanismeInfo(parcelleGeometry: any) {
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
      this.logger.error(`Erreur lors de la récupération des informations d'urbanisme : ${error.message}`);
      throw error;
    }
  }

  /**
   * Extrait les informations principales d'un document d'urbanisme
   * @param documentData Données complètes du document
   * @returns Informations principales du document
   */
  extractDocumentInfo(documentData: any) {
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
   * @param zonagesData Données complètes des zonages
   * @returns Liste des informations principales des zonages
   */
  extractZonagesInfo(zonagesData: any) {
    if (!zonagesData || !zonagesData.features || zonagesData.features.length === 0) {
      return [];
    }
    
    return zonagesData.features.map((zonage: any) => {
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
   * @param geometry Géométrie GeoJSON
   * @returns Coordonnées du centre [longitude, latitude]
   */
  calculateCenter(geometry: any): [number, number] {
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