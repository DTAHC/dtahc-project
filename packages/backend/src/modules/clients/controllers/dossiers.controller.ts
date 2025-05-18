import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { DossiersService } from '../services/dossiers.service';
import { CreateDossierDto } from '../dto/create-dossier.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/dossiers')
@UseGuards(JwtAuthGuard)
export class DossiersController {
  constructor(private readonly dossiersService: DossiersService) {}

  @Post()
  async create(@Body() createDossierDto: CreateDossierDto, @Req() req: Request) {
    // @ts-ignore - L'objet user est bien ajouté dans le middleware d'authentification
    const userId = req.user.userId;
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