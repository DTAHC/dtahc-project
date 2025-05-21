import { Controller, Get, Post, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { ExternalSourcesService, ServiceStatus } from '../services/external-sources.service';

@Controller('api/admin/settings')
export class AdminSettingsController {
  private readonly logger = new Logger(AdminSettingsController.name);

  constructor(private readonly externalSourcesService: ExternalSourcesService) {}

  @Get('external-sources')
  async getAllServiceConfigs() {
    this.logger.log('Récupération de toutes les configurations des sources externes');
    
    return {
      success: true,
      data: this.externalSourcesService.getAllServiceConfigs()
    };
  }

  @Get('external-sources/:serviceName')
  async getServiceConfig(@Param('serviceName') serviceName: string) {
    this.logger.log(`Récupération de la configuration du service: ${serviceName}`);
    
    const config = this.externalSourcesService.getServiceConfig(serviceName);
    
    if (!config) {
      return {
        success: false,
        message: `Service non trouvé: ${serviceName}`
      };
    }
    
    return {
      success: true,
      data: config
    };
  }

  @Post('external-sources/:serviceName')
  async updateServiceConfig(
    @Param('serviceName') serviceName: string,
    @Body() configData: any
  ) {
    this.logger.log(`Mise à jour de la configuration du service: ${serviceName}`);
    
    try {
      const updatedConfig = await this.externalSourcesService.updateServiceConfig(serviceName, configData);
      
      return {
        success: true,
        data: updatedConfig
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour de la configuration: ${error.message}`);
      
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Post('external-sources/:serviceName/status')
  async setServiceStatus(
    @Param('serviceName') serviceName: string,
    @Body() statusData: { status: ServiceStatus }
  ) {
    this.logger.log(`Mise à jour du statut du service ${serviceName} à ${statusData.status}`);
    
    try {
      const updatedConfig = await this.externalSourcesService.setServiceStatus(
        serviceName,
        statusData.status
      );
      
      return {
        success: true,
        data: updatedConfig
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour du statut: ${error.message}`);
      
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('external-sources/:serviceName/stats')
  async getServiceStats(@Param('serviceName') serviceName: string) {
    this.logger.log(`Récupération des statistiques du service: ${serviceName}`);
    
    const stats = this.externalSourcesService.getServiceStats(serviceName);
    
    if (!stats) {
      return {
        success: false,
        message: `Service non trouvé: ${serviceName}`
      };
    }
    
    return {
      success: true,
      data: stats
    };
  }
}