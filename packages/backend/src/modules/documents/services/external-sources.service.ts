import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export enum ServiceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface ExternalServiceConfig {
  name: string;
  apiUrl: string;
  apiKey?: string;
  status: ServiceStatus;
  options: Record<string, any>;
  lastCheck: Date;
  usageCount: number;
  errorCount: number;
}

@Injectable()
export class ExternalSourcesService {
  private readonly logger = new Logger(ExternalSourcesService.name);
  private configs: Record<string, ExternalServiceConfig> = {};
  
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    this.initializeConfigs();
  }
  
  /**
   * Initialise les configurations à partir des valeurs par défaut
   * Dans une implémentation réelle, ces valeurs seraient stockées en base de données
   * et récupérées au démarrage du service
   */
  private async initializeConfigs() {
    // Configuration par défaut pour le cadastre
    this.configs['cadastre'] = {
      name: 'API Carto - Cadastre',
      apiUrl: this.configService.get<string>('documents.cadastre.apiBaseUrl') || 'https://apicarto.ign.fr/api/cadastre',
      status: ServiceStatus.ONLINE,
      options: {
        extractionMethods: ['reference', 'coordinates', 'address'],
        planScales: [500, 3500],
        cacheRefreshRateHours: parseInt(this.configService.get('documents.cadastre.cacheDurationHours') || '24', 10)
      },
      lastCheck: new Date(),
      usageCount: 0,
      errorCount: 0
    };
    
    // Configuration par défaut pour l'urbanisme
    this.configs['urbanisme'] = {
      name: 'API Carto - GPU',
      apiUrl: this.configService.get<string>('documents.urbanisme.apiBaseUrl') || 'https://apicarto.ign.fr/api/gpu',
      status: ServiceStatus.ONLINE,
      options: {
        extractDocuments: true,
        extractZonages: true,
        extractPrescriptions: false, // Nécessite WFS
        extractServitudes: false,    // Nécessite WFS
        cacheDurationHours: parseInt(this.configService.get('documents.urbanisme.cacheDurationHours') || '48', 10)
      },
      lastCheck: new Date(),
      usageCount: 0,
      errorCount: 0
    };
    
    // Configuration par défaut pour CERFA
    this.configs['cerfa'] = {
      name: 'Générateur CERFA',
      apiUrl: '/api/internal/cerfa',
      status: ServiceStatus.ONLINE,
      options: {
        availableTemplates: ['DP', 'PC', 'PCMI', 'PA', 'CU'],
        outputFormats: ['PDF', 'DOCX'],
        templatesDirectory: this.configService.get('documents.cerfa.templatesPath') || '/templates/cerfa',
        autoGenerateNotice: this.configService.get('documents.cerfa.autoGenerateNotice') === 'true'
      },
      lastCheck: new Date(),
      usageCount: 0,
      errorCount: 0
    };
    
    this.logger.log('Configurations des sources externes initialisées');
  }
  
  /**
   * Récupère la configuration d'un service externe
   * @param serviceName Nom du service (cadastre, urbanisme, cerfa)
   * @returns Configuration du service ou null si non trouvée
   */
  getServiceConfig(serviceName: string): ExternalServiceConfig | null {
    if (!this.configs[serviceName]) {
      this.logger.warn(`Configuration non trouvée pour le service: ${serviceName}`);
      return null;
    }
    return this.configs[serviceName];
  }
  
  /**
   * Récupère les configurations de tous les services externes
   * @returns Objet contenant toutes les configurations
   */
  getAllServiceConfigs(): Record<string, ExternalServiceConfig> {
    return this.configs;
  }
  
  /**
   * Met à jour la configuration d'un service externe
   * @param serviceName Nom du service (cadastre, urbanisme, cerfa)
   * @param config Nouvelle configuration
   * @returns Configuration mise à jour
   */
  async updateServiceConfig(
    serviceName: string, 
    config: Partial<ExternalServiceConfig>
  ): Promise<ExternalServiceConfig> {
    if (!this.configs[serviceName]) {
      this.logger.warn(`Tentative de mise à jour d'une configuration inexistante: ${serviceName}`);
      throw new Error(`Service non trouvé: ${serviceName}`);
    }
    
    // Mise à jour de la configuration
    this.configs[serviceName] = {
      ...this.configs[serviceName],
      ...config,
      lastCheck: new Date()
    };
    
    this.logger.log(`Configuration du service ${serviceName} mise à jour`);
    
    // Dans une implémentation réelle, on sauvegarderait en base de données ici
    // await this.prisma.serviceConfig.update({ ... });
    
    return this.configs[serviceName];
  }
  
  /**
   * Incrémente le compteur d'utilisation d'un service
   * @param serviceName Nom du service
   */
  incrementUsageCount(serviceName: string): void {
    if (this.configs[serviceName]) {
      this.configs[serviceName].usageCount++;
      // Dans une vraie implémentation, mettre à jour en DB
    }
  }
  
  /**
   * Incrémente le compteur d'erreurs d'un service
   * @param serviceName Nom du service
   */
  incrementErrorCount(serviceName: string): void {
    if (this.configs[serviceName]) {
      this.configs[serviceName].errorCount++;
      // Dans une vraie implémentation, mettre à jour en DB
    }
  }
  
  /**
   * Vérifie si un service est disponible
   * @param serviceName Nom du service
   * @returns Booléen indiquant si le service est disponible
   */
  isServiceAvailable(serviceName: string): boolean {
    if (!this.configs[serviceName]) {
      return false;
    }
    return this.configs[serviceName].status === ServiceStatus.ONLINE;
  }
  
  /**
   * Récupère les statistiques d'utilisation d'un service
   * @param serviceName Nom du service
   * @returns Statistiques d'utilisation ou null si non trouvé
   */
  getServiceStats(serviceName: string): { usageCount: number; errorCount: number } | null {
    if (!this.configs[serviceName]) {
      return null;
    }
    
    return {
      usageCount: this.configs[serviceName].usageCount,
      errorCount: this.configs[serviceName].errorCount
    };
  }
  
  /**
   * Met à jour le statut d'un service
   * @param serviceName Nom du service
   * @param status Nouveau statut
   * @returns Configuration mise à jour
   */
  async setServiceStatus(
    serviceName: string, 
    status: ServiceStatus
  ): Promise<ExternalServiceConfig> {
    if (!this.configs[serviceName]) {
      throw new Error(`Service non trouvé: ${serviceName}`);
    }
    
    this.configs[serviceName].status = status;
    this.configs[serviceName].lastCheck = new Date();
    
    this.logger.log(`Statut du service ${serviceName} mis à jour à ${status}`);
    
    // Dans une implémentation réelle, on sauvegarderait en base de données ici
    // await this.prisma.serviceConfig.update({ ... });
    
    return this.configs[serviceName];
  }
}