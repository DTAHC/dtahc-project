import { Body, Controller, Get, Param, Post, Put, Query, Req, Logger, UseGuards, Delete } from '@nestjs/common';
import { ClientsService } from '../services/clients.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('clients')
// @UseGuards(JwtAuthGuard) // Temporairement désactivé pour les tests
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Crée un nouveau client avec informations minimales ou complètes
   */
  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Req() req: Request) {
    try {
      // Utiliser un ID utilisateur valide existant dans la base de données
      const validUserId = '89aa20af-7cb2-4792-8f98-ad0428124aa9'; // ID existant dans la base de données
      
      // @ts-ignore - L'objet user est ajouté dans le middleware d'authentification quand il est activé
      const userId = req.user?.userId || validUserId;
      
      this.logger.log(`Création de client par l'utilisateur ID: ${userId}`);
      return await this.clientsService.create(createClientDto, userId);
    } catch (error) {
      this.logger.error(`Erreur lors de la création du client: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère tous les clients
   */
  @Get()
  async findAll() {
    return this.clientsService.findAll();
  }

  /**
   * Recherche de clients par terme
   */
  @Get('search')
  async search(@Query('q') query: string) {
    return this.clientsService.search(query);
  }

  /**
   * Récupère un client spécifique par ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  /**
   * Renvoie un lien de formulaire client
   */
  @Post(':id/resend-form')
  @UseGuards(JwtAuthGuard)
  async resendFormLink(@Param('id') id: string) {
    this.logger.log(`Demande de renvoi de lien pour le client ${id}`);
    const result = await this.clientsService.resendFormLink(id);
    return { success: result };
  }

  /**
   * Met à jour les informations d'un client
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    this.logger.log(`Mise à jour du client ${id}`);
    return this.clientsService.update(id, updateData);
  }

  /**
   * Supprime un client
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Suppression du client ${id}`);
    await this.clientsService.remove(id);
    return { success: true, message: 'Client supprimé avec succès' };
  }
}