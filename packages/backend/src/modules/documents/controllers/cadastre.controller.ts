import { Controller, Get, Post, Body, Query, Param, UseGuards, Logger } from '@nestjs/common';
import { CadastreService } from '../services/cadastre.service';
import { CadastreMapService } from '../services/cadastre-map.service';
import { 
  ParcelleByReferenceDto, 
  ParcelleByCoordinatesDto, 
  ParcellesByCommuneDto,
  CommuneDto,
  FeuilleCadastraleDto,
  LocalisantDto,
  GenerateMapDto
} from '../dto/cadastre.dto';

@Controller('api/cadastre')
export class CadastreController {
  private readonly logger = new Logger(CadastreController.name);

  constructor(
    private readonly cadastreService: CadastreService,
    private readonly cadastreMapService: CadastreMapService
  ) {}

  @Post('parcelle/reference')
  async getParcelleByReference(@Body() parcelleDto: ParcelleByReferenceDto) {
    this.logger.log(`Recherche de parcelle par référence: ${parcelleDto.codeInsee} ${parcelleDto.section} ${parcelleDto.numero}`);
    
    const parcelleData = await this.cadastreService.getParcelleByReference(
      parcelleDto.codeInsee,
      parcelleDto.section,
      parcelleDto.numero
    );
    
    if (!parcelleData) {
      return {
        success: false,
        message: 'Aucune parcelle trouvée avec ces références'
      };
    }
    
    const parcelleInfo = this.cadastreService.extractParcelleInfo(parcelleData);
    
    return {
      success: true,
      data: parcelleInfo,
      raw: parcelleData
    };
  }

  @Post('parcelle/coordinates')
  async getParcelleByCoordinates(@Body() coordinatesDto: ParcelleByCoordinatesDto) {
    this.logger.log(`Recherche de parcelle par coordonnées: ${coordinatesDto.longitude}, ${coordinatesDto.latitude}`);
    
    const parcelleData = await this.cadastreService.getParcelleByCoordinates(
      coordinatesDto.longitude,
      coordinatesDto.latitude
    );
    
    if (!parcelleData) {
      return {
        success: false,
        message: 'Aucune parcelle trouvée à ces coordonnées'
      };
    }
    
    const parcelleInfo = this.cadastreService.extractParcelleInfo(parcelleData);
    
    return {
      success: true,
      data: parcelleInfo,
      raw: parcelleData
    };
  }

  @Post('parcelles/commune')
  async getParcellesByCommune(@Body() communeDto: ParcellesByCommuneDto) {
    this.logger.log(`Recherche des parcelles pour la commune: ${communeDto.codeInsee}`);
    
    const parcellesData = await this.cadastreService.getParcellesByCommune(
      communeDto.codeInsee,
      communeDto.limit,
      communeDto.start
    );
    
    if (!parcellesData) {
      return {
        success: false,
        message: 'Aucune parcelle trouvée pour cette commune'
      };
    }
    
    return {
      success: true,
      totalFeatures: parcellesData.totalFeatures,
      data: parcellesData
    };
  }

  @Get('commune/:codeInsee')
  async getCommune(@Param('codeInsee') codeInsee: string) {
    this.logger.log(`Recherche d'informations sur la commune: ${codeInsee}`);
    
    const communeData = await this.cadastreService.getCommune(codeInsee);
    
    if (!communeData) {
      return {
        success: false,
        message: 'Commune non trouvée'
      };
    }
    
    return {
      success: true,
      data: communeData
    };
  }

  @Get('feuilles/:codeInsee')
  async getFeuillesCadastrales(
    @Param('codeInsee') codeInsee: string,
    @Query('section') section?: string
  ) {
    this.logger.log(`Recherche des feuilles cadastrales pour la commune: ${codeInsee}, section: ${section || 'toutes'}`);
    
    const feuillesData = await this.cadastreService.getFeuillesCadastrales(codeInsee, section);
    
    if (!feuillesData) {
      return {
        success: false,
        message: 'Aucune feuille cadastrale trouvée'
      };
    }
    
    return {
      success: true,
      data: feuillesData
    };
  }

  @Post('localisants')
  async getLocalisants(@Body() localisantDto: LocalisantDto) {
    this.logger.log(`Recherche des localisants pour la parcelle: ${localisantDto.codeInsee} ${localisantDto.section} ${localisantDto.numero}`);
    
    const localisantsData = await this.cadastreService.getLocalisants(
      localisantDto.codeInsee,
      localisantDto.section,
      localisantDto.numero
    );
    
    if (!localisantsData) {
      return {
        success: false,
        message: 'Aucun localisant trouvé pour cette parcelle'
      };
    }
    
    return {
      success: true,
      data: localisantsData
    };
  }

  @Post('generate-map')
  async generateMap(@Body() mapDto: GenerateMapDto) {
    this.logger.log(`Génération de plan pour la parcelle: ${mapDto.codeInsee} ${mapDto.section} ${mapDto.numero}`);
    
    try {
      // 1. Récupération des données de la parcelle
      const parcelleData = await this.cadastreService.getParcelleByReference(
        mapDto.codeInsee,
        mapDto.section,
        mapDto.numero
      );
      
      if (!parcelleData) {
        return {
          success: false,
          message: 'Parcelle non trouvée avec ces références'
        };
      }
      
      // 2. Génération des paramètres pour les cartes
      let map500Params, map3500Params, html;
      
      if (!mapDto.scale || mapDto.scale === 500) {
        map500Params = this.cadastreMapService.generateMap500Parameters(parcelleData);
        html = this.cadastreMapService.generateLeafletMapHTML(map500Params);
      } else if (mapDto.scale === 3500) {
        map3500Params = this.cadastreMapService.generateMap3500Parameters(parcelleData);
        html = this.cadastreMapService.generateLeafletMapHTML(map3500Params);
      } else {
        return {
          success: false,
          message: 'Échelle non supportée. Utilisez 500 ou 3500.'
        };
      }
      
      // 3. On retourne le HTML généré
      return {
        success: true,
        parcelleInfo: this.cadastreService.extractParcelleInfo(parcelleData),
        html: html
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la génération du plan: ${error.message}`);
      return {
        success: false,
        message: `Erreur lors de la génération du plan: ${error.message}`
      };
    }
  }
}