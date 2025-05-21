import { Controller, Post, Body, Get, Param, Query, UseGuards, Logger } from '@nestjs/common';
import { UrbanismeService } from '../services/urbanisme.service';
import { CadastreService } from '../services/cadastre.service';
import {
  DocumentUrbanismeDto,
  ZonagesDto,
  ServitudesDto,
  PrescriptionsDto,
  ReglementDto,
  CompleteUrbanismeInfoDto,
  UrbanismeByParcelleDto
} from '../dto/urbanisme.dto';

@Controller('api/urbanisme')
export class UrbanismeController {
  private readonly logger = new Logger(UrbanismeController.name);

  constructor(
    private readonly urbanismeService: UrbanismeService,
    private readonly cadastreService: CadastreService
  ) {}

  @Post('document')
  async getDocumentUrbanisme(@Body() documentDto: DocumentUrbanismeDto) {
    this.logger.log(`Recherche de document d'urbanisme aux coordonnées: ${documentDto.longitude}, ${documentDto.latitude}`);
    
    const documentData = await this.urbanismeService.getDocumentUrbanisme(
      documentDto.longitude,
      documentDto.latitude
    );
    
    if (!documentData) {
      return {
        success: false,
        message: 'Aucun document d\'urbanisme trouvé à ces coordonnées'
      };
    }
    
    const documentInfo = this.urbanismeService.extractDocumentInfo(documentData);
    
    return {
      success: true,
      data: documentInfo,
      raw: documentData
    };
  }

  @Post('zonages')
  async getZonages(@Body() zonagesDto: ZonagesDto) {
    this.logger.log('Recherche de zonages d\'urbanisme');
    
    const zonagesData = await this.urbanismeService.getZonages(zonagesDto.geometry);
    
    if (!zonagesData) {
      return {
        success: false,
        message: 'Aucun zonage d\'urbanisme trouvé pour cette géométrie'
      };
    }
    
    const zonagesInfo = this.urbanismeService.extractZonagesInfo(zonagesData);
    
    return {
      success: true,
      data: zonagesInfo,
      raw: zonagesData
    };
  }

  @Post('servitudes')
  async getServitudes(@Body() servitudesDto: ServitudesDto) {
    this.logger.log('Recherche de servitudes d\'urbanisme');
    
    const servitudesData = await this.urbanismeService.getServitudes(servitudesDto.geometry);
    
    // Cette fonction n'est pas complètement implémentée dans l'API
    return {
      success: false,
      message: 'Service non disponible via l\'API Carto. Utiliser le service WFS du GPU directement.',
      data: servitudesData
    };
  }

  @Post('prescriptions')
  async getPrescriptions(@Body() prescriptionsDto: PrescriptionsDto) {
    this.logger.log('Recherche de prescriptions d\'urbanisme');
    
    const prescriptionsData = await this.urbanismeService.getPrescriptions(prescriptionsDto.geometry);
    
    // Cette fonction n'est pas complètement implémentée dans l'API
    return {
      success: false,
      message: 'Service non disponible via l\'API Carto. Utiliser le service WFS du GPU directement.',
      data: prescriptionsData
    };
  }

  @Post('reglement')
  async getReglement(@Body() reglementDto: ReglementDto) {
    this.logger.log(`Recherche de règlement pour le document ${reglementDto.idDocument}, zonage ${reglementDto.idZonage}`);
    
    const reglementData = await this.urbanismeService.getReglement(
      reglementDto.idDocument,
      reglementDto.idZonage
    );
    
    return {
      success: true,
      data: reglementData
    };
  }

  @Post('info-complete')
  async getCompleteUrbanismeInfo(@Body() infoDto: CompleteUrbanismeInfoDto) {
    this.logger.log('Recherche d\'informations d\'urbanisme complètes');
    
    const urbanismeInfo = await this.urbanismeService.getCompleteUrbanismeInfo(infoDto.parcelleGeometry);
    
    return {
      success: true,
      data: urbanismeInfo
    };
  }

  @Post('info-by-parcelle')
  async getUrbanismeByParcelle(@Body() parcelleDto: UrbanismeByParcelleDto) {
    this.logger.log(`Recherche d'informations d'urbanisme pour la parcelle: ${parcelleDto.codeInsee} ${parcelleDto.section} ${parcelleDto.numero}`);
    
    try {
      // 1. Récupération des données de la parcelle
      const parcelleData = await this.cadastreService.getParcelleByReference(
        parcelleDto.codeInsee,
        parcelleDto.section,
        parcelleDto.numero
      );
      
      if (!parcelleData || !parcelleData.features || parcelleData.features.length === 0) {
        return {
          success: false,
          message: 'Parcelle non trouvée avec ces références'
        };
      }
      
      // 2. Récupération des informations d'urbanisme
      const parcelleGeometry = parcelleData.features[0].geometry;
      const urbanismeInfo = await this.urbanismeService.getCompleteUrbanismeInfo(parcelleGeometry);
      
      // 3. Construction de la réponse
      return {
        success: true,
        parcelle: this.cadastreService.extractParcelleInfo(parcelleData),
        urbanisme: urbanismeInfo
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des informations d'urbanisme: ${error.message}`);
      return {
        success: false,
        message: `Erreur lors de la récupération des informations d'urbanisme: ${error.message}`
      };
    }
  }
}