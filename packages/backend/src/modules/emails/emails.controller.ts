import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Define interfaces for controller input/output
interface EmailData {
  to: string;
  subject: string;
  content: string;
  fromName?: string;
}

interface TemplateEmailData {
  to: string;
  templateId: string;
  variables: Record<string, string>;
}

interface PreviewData {
  content: string;
  variables?: Record<string, string>;
}

interface TestEmailData {
  email: string;
  templateId?: string;
}

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  /**
   * Envoie un email personnalisé
   */
  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendCustomEmail(@Body() emailData: EmailData) {
    const { to, subject, content, fromName } = emailData;
    return {
      success: await this.emailsService.sendCustomEmail(to, subject, content, fromName),
    };
  }

  /**
   * Envoie un email à partir d'un modèle
   */
  @Post('send-template')
  @UseGuards(JwtAuthGuard)
  async sendTemplateEmail(@Body() emailData: TemplateEmailData) {
    const { to, templateId, variables } = emailData;
    return {
      success: await this.emailsService.sendTemplateEmail(to, templateId, variables),
    };
  }

  /**
   * Génère un aperçu d'email avec variables remplacées
   */
  @Post('preview')
  @UseGuards(JwtAuthGuard)
  async generateEmailPreview(@Body() previewData: PreviewData) {
    const { content, variables } = previewData;
    const preview = await this.emailsService.generateEmailPreview(content, variables || {});
    return { preview };
  }
  
  /**
   * Génère un aperçu d'email avec variables remplacées - Point d'API public
   */
  @Post('public/preview')
  // Pas de garde d'authentification pour cette route spécifique
  async generatePublicEmailPreview(@Body() previewData: PreviewData) {
    const { content, variables } = previewData;
    const preview = await this.emailsService.generateEmailPreview(content, variables || {});
    return { preview };
  }

  /**
   * Récupère l'historique des emails envoyés
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getEmailHistory() {
    return this.emailsService.getEmailHistory();
  }

  /**
   * Récupère tous les modèles d'emails
   */
  @Get('templates')
  @UseGuards(JwtAuthGuard)
  async getEmailTemplates(): Promise<any[]> {
    return this.emailsService.getEmailTemplates();
  }

  /**
   * Récupère un modèle d'email spécifique
   */
  @Get('templates/:id')
  @UseGuards(JwtAuthGuard)
  async getEmailTemplate(@Param('id') id: string): Promise<any> {
    const templates = await this.emailsService.getEmailTemplates();
    return templates.find((template: any) => template.id === id);
  }

  /**
   * Crée ou met à jour un modèle d'email
   */
  @Post('templates')
  @UseGuards(JwtAuthGuard)
  async createEmailTemplate(@Body() templateData: any) {
    return this.emailsService.saveEmailTemplate(templateData);
  }

  /**
   * Met à jour un modèle d'email existant
   */
  @Put('templates/:id')
  @UseGuards(JwtAuthGuard)
  async updateEmailTemplate(@Param('id') id: string, @Body() templateData: any) {
    return this.emailsService.saveEmailTemplate({ ...templateData, id });
  }

  /**
   * Supprime un modèle d'email
   */
  @Delete('templates/:id')
  @UseGuards(JwtAuthGuard)
  async deleteEmailTemplate(@Param('id') id: string) {
    return this.emailsService.deleteEmailTemplate(id);
  }

  /**
   * Envoie un email de test à un client
   */
  @Post('test')
  @UseGuards(JwtAuthGuard)
  async sendTestEmail(@Body() testData: TestEmailData) {
    const { email, templateId } = testData;
    
    if (templateId) {
      // Envoyer un email de test basé sur un modèle
      const templates = await this.emailsService.getEmailTemplates();
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        return { success: false, message: 'Modèle non trouvé' };
      }
      
      // Utiliser des variables de test
      const testVariables = {
        NOM_CLIENT: 'Client Test',
        ADRESSE_PROJET: '123 Rue de Test, 75000 Paris',
        REFERENCE: 'TEST-2025-001',
        // Autres variables selon besoin
      };
      
      return {
        success: await this.emailsService.sendTemplateEmail(email, templateId, testVariables),
      };
    } else {
      // Envoyer un email de test simple
      return {
        success: await this.emailsService.sendCustomEmail(
          email,
          'Email de test DTAHC',
          '<p>Ceci est un email de test envoyé depuis l\'application DTAHC.</p><p>Si vous recevez cet email, la configuration est correcte.</p>',
          'Test DTAHC'
        ),
      };
    }
  }
}