import { 
  Controller, Post, Body, Param, Get, UseGuards,
  BadRequestException, NotFoundException, Logger
} from '@nestjs/common';
import { FormLinksService } from '../services/form-links.service';
import { ClientsService } from '../services/clients.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FormType } from '@prisma/client';

@Controller('clients')
export class FormLinksController {
  private readonly logger = new Logger(FormLinksController.name);

  constructor(
    private readonly formLinksService: FormLinksService,
    private readonly clientsService: ClientsService,
  ) {}

  /**
   * Crée un lien de formulaire pour un client (route protégée)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':clientId/form-links')
  async createFormLink(@Param('clientId') clientId: string) {
    try {
      const formLink = await this.formLinksService.createFormLink(clientId, FormType.CLIENT_FORM);
      return formLink;
    } catch (error) {
      this.logger.error(`Erreur lors de la création du lien: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création du lien de formulaire');
    }
  }

  /**
   * Envoie un email avec un lien de formulaire (route protégée)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':clientId/send-form-link')
  async sendFormLink(@Param('clientId') clientId: string) {
    try {
      // Crée un lien si nécessaire et envoie l'email
      const result = await this.clientsService.resendFormLink(clientId);
      
      if (!result) {
        throw new BadRequestException("Échec de l'envoi de l'email");
      }
      
      return { success: true, message: "Email envoyé avec succès" };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de l\'envoi de l\'email');
    }
  }
  
  /**
   * Renvoie le lien de formulaire sans authentification (pour les tests en développement)
   */
  @Post(':clientId/resend-form')
  async resendFormLinkPublic(@Param('clientId') clientId: string, @Body() body: any) {
    try {
      this.logger.log(`Demande publique de renvoi de lien pour le client ${clientId}`);
      // Crée un lien si nécessaire et envoie l'email
      const result = await this.clientsService.resendFormLink(clientId);
      
      if (!result) {
        throw new BadRequestException("Échec de l'envoi de l'email");
      }
      
      return { success: true, message: "Email envoyé avec succès" };
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email (public): ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de l\'envoi de l\'email');
    }
  }

  /**
   * Vérifie la validité d'un token pour un formulaire public
   */
  @Get('form/:token/validate')
  async validateToken(@Param('token') token: string) {
    try {
      const result = await this.formLinksService.validateToken(token);
      
      // Retourner uniquement les informations nécessaires
      return {
        valid: true,
        client: {
          id: result.client.id,
          firstName: result.client.contactInfo?.firstName,
          lastName: result.client.contactInfo?.lastName,
          email: result.client.contactInfo?.email,
        }
      };
    } catch (error) {
      this.logger.error(`Token invalid: ${error.message}`);
      return { valid: false, message: error.message };
    }
  }

  /**
   * Marque un formulaire comme complété suite à la soumission du client
   */
  @Post('form/:token/complete')
  async completeForm(
    @Param('token') token: string,
    @Body() formData: any
  ) {
    try {
      // Valider le token
      const { formLink, client } = await this.formLinksService.validateToken(token);
      
      // Mettre à jour les informations du client
      const updatedClient = await this.clientsService.updateClientFromForm(client.id, formData);
      
      // Marquer le formulaire comme complété
      await this.formLinksService.markFormAsCompleted(token);
      
      return { 
        success: true, 
        message: "Formulaire complété avec succès",
        clientId: client.id
      };
    } catch (error) {
      this.logger.error(`Erreur lors de la complétion du formulaire: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la soumission du formulaire');
    }
  }

  /**
   * Récupère l'historique des liens de formulaires pour un client (route protégée)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':clientId/form-links')
  async getFormLinksByClient(@Param('clientId') clientId: string) {
    try {
      return await this.formLinksService.getFormLinksByClient(clientId);
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des liens: ${error.message}`);
      throw new BadRequestException('Erreur lors de la récupération des liens de formulaire');
    }
  }
}