import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DossiersService } from '../services/dossiers.service';
import { CreateDossierDto } from '../dto/create-dossier.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('dossiers')
// @UseGuards(JwtAuthGuard) // Temporairement désactivé pour les tests
export class DossiersController {
  constructor(private readonly dossiersService: DossiersService) {}

  @Post()
  async create(@Body() createDossierDto: CreateDossierDto, @Req() req: Request) {
    // Pour les tests, utiliser un ID fixe si aucun utilisateur n'est authentifié
    // @ts-ignore - L'objet user est ajouté dans le middleware d'authentification quand il est activé
    const userId = req.user?.userId || '00000000-0000-0000-0000-000000000000'; // ID par défaut pour les tests
    return this.dossiersService.create(createDossierDto, userId);
  }

  @Get()
  async findAll() {
    return this.dossiersService.findAll();
  }

  @Get('client/:clientId')
  async findByClient(@Param('clientId') clientId: string) {
    return this.dossiersService.findByClient(clientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.dossiersService.findOne(id);
  }
}