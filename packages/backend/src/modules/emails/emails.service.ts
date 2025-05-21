import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../common/prisma/prisma.service';

// TypeScript interfaces for type safety
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  fromName?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EmailSent {
  id: string;
  toEmail: string;
  subject: string;
  content: string;
  sentAt: Date;
  status: string;
  errorMessage?: string | null;
  templateId?: string | null;
}

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Récupération des configurations SMTP depuis les variables d'environnement ou utiliser IONOS par défaut
    const host = this.configService.get<string>('SMTP_HOST') || 'smtp.ionos.fr';
    const port = this.configService.get<number>('SMTP_PORT') || 465;
    const secure = this.configService.get<boolean>('SMTP_SECURE') || true;
    const user = this.configService.get<string>('SMTP_USER') || 'dossiers@autorisations.fr';
    const pass = this.configService.get<string>('SMTP_PASS') || 'Dtahcsarl@97230';

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: false // Nécessaire pour certains environnements
        }
      });

      // Vérifier la connexion au serveur SMTP
      this.transporter.verify((error: Error | null) => {
        if (error) {
          this.logger.error(`Erreur de connexion au serveur SMTP: ${error.message}`);
        } else {
          this.logger.log('Connexion au serveur SMTP réussie, prêt à envoyer des emails');
        }
      });

      this.logger.log('Transporter email initialisé avec succès');
    } catch (error) {
      this.logger.error(`Erreur lors de l'initialisation du transporter email: ${error.message}`);
      throw error;
    }
  }

  async sendClientFormLink(email: string, firstName: string, lastName: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const formLink = `${frontendUrl}/fiche-projet/${token}`;
    const siteName = this.configService.get<string>('SITE_NAME') || 'DTAHC';
    
    const mailOptions = {
      from: `"${siteName}" <${this.configService.get<string>('SMTP_FROM') || 'contact@dtahc.fr'}>`,
      to: email,
      subject: `Complétez votre fiche client - ${siteName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1D4ED8; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${siteName}</h1>
            <p style="margin: 10px 0 0;">Portail Client</p>
          </div>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 5px 5px;">
            <p style="margin-top: 0;">Bonjour ${firstName} ${lastName},</p>
            
            <p>Nous vous remercions de votre confiance pour votre projet. Pour nous permettre de traiter votre dossier de manière efficace, nous avons besoin de quelques informations complémentaires.</p>
            
            <p>Veuillez cliquer sur le lien ci-dessous pour accéder à votre formulaire de fiche client :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${formLink}" style="background-color: #1D4ED8; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">Accéder à ma fiche client</a>
            </div>
            
            <p style="font-size: 12px; color: #6b7280;">Ce lien est personnel et valable pendant 7 jours. Si vous rencontrez des difficultés pour remplir le formulaire, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br>L'équipe ${siteName}</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de formulaire client envoyé avec succès à ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email à ${email}: ${error.message}`);
      return false;
    }
  }

  async sendFormLinkReminderEmail(email: string, firstName: string, lastName: string, token: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const formLink = `${frontendUrl}/fiche-projet/${token}`;
    const siteName = this.configService.get<string>('SITE_NAME') || 'DTAHC';
    
    const mailOptions = {
      from: `"${siteName}" <${this.configService.get<string>('SMTP_FROM') || 'contact@dtahc.fr'}>`,
      to: email,
      subject: `Rappel: Complétez votre fiche client - ${siteName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1D4ED8; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${siteName}</h1>
            <p style="margin: 10px 0 0;">Portail Client</p>
          </div>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 5px 5px;">
            <p style="margin-top: 0;">Bonjour ${firstName} ${lastName},</p>
            
            <p>Nous remarquons que vous n'avez pas encore complété votre fiche client. Ces informations sont essentielles pour nous permettre d'avancer efficacement sur votre projet.</p>
            
            <p>Veuillez cliquer sur le lien ci-dessous pour accéder à votre formulaire :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${formLink}" style="background-color: #1D4ED8; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">Compléter ma fiche client</a>
            </div>
            
            <p style="font-size: 12px; color: #6b7280;">Ce lien est personnel et valable pendant 7 jours. Si vous rencontrez des difficultés pour remplir le formulaire, n'hésitez pas à nous contacter.</p>
            
            <p>Cordialement,<br>L'équipe ${siteName}</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de rappel envoyé avec succès à ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email de rappel à ${email}: ${error.message}`);
      return false;
    }
  }

  async sendFormCompletedNotification(adminEmail: string, clientName: string, clientId: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const clientUrl = `${frontendUrl}/clients/${clientId}`;
    const siteName = this.configService.get<string>('SITE_NAME') || 'DTAHC';
    
    const mailOptions = {
      from: `"${siteName}" <${this.configService.get<string>('SMTP_FROM') || 'dossiers@autorisations.fr'}>`,
      to: adminEmail,
      subject: `Nouvelle fiche client complétée - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1D4ED8; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${siteName}</h1>
            <p style="margin: 10px 0 0;">Notification Administrateur</p>
          </div>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 5px 5px;">
            <p style="margin-top: 0;">Bonjour,</p>
            
            <p>Un client vient de compléter sa fiche d'information :</p>
            
            <div style="background-color: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Client: ${clientName}</p>
            </div>
            
            <p>Vous pouvez consulter les détails en cliquant sur le lien ci-dessous :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${clientUrl}" style="background-color: #1D4ED8; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">Voir la fiche complète</a>
            </div>
            
            <p>Cordialement,<br>Le système de notification ${siteName}</p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Notification de formulaire complété envoyée avec succès à ${adminEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de la notification à ${adminEmail}: ${error.message}`);
      return false;
    }
  }

  /**
   * Envoie un email personnalisé à un client
   */
  async sendCustomEmail(to: string, subject: string, content: string, fromName: string = 'DTAHC'): Promise<boolean> {
    const siteName = this.configService.get<string>('SITE_NAME') || 'DTAHC';
    
    const mailOptions = {
      from: `"${fromName}" <${this.configService.get<string>('SMTP_FROM') || 'dossiers@autorisations.fr'}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1D4ED8; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${siteName}</h1>
          </div>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 5px 5px;">
            ${content}
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email personnalisé envoyé avec succès à ${to}`);
      
      // Enregistrer l'historique de l'email envoyé
      await this.prisma.emailSent.create({
        data: {
          toEmail: to,
          subject,
          content,
          sentAt: new Date(),
          status: 'SUCCESS',
        },
      });
      
      return true;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email à ${to}: ${error.message}`);
      
      // Enregistrer l'échec dans l'historique
      await this.prisma.emailSent.create({
        data: {
          toEmail: to,
          subject,
          content,
          sentAt: new Date(),
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
      
      return false;
    }
  }

  /**
   * Envoyer un email à partir d'un modèle prédéfini
   */
  async sendTemplateEmail(to: string, templateId: string, variables: Record<string, string>): Promise<boolean> {
    try {
      // Récupérer le modèle d'email depuis la base de données
      const template = await this.prisma.emailTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new Error(`Modèle d'email avec l'ID ${templateId} non trouvé`);
      }

      // Remplacer les variables dans le contenu et le sujet
      let content = template.content;
      let subject = template.subject;

      // Remplacer les variables dans le contenu et le sujet
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{${key}}`, 'g');
        content = content.replace(regex, value);
        subject = subject.replace(regex, value);
      });

      // Envoyer l'email avec le contenu personnalisé
      return this.sendCustomEmail(to, subject, content, template.fromName || undefined);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email avec template ${templateId}: ${error.message}`);
      return false;
    }
  }

  /**
   * Récupère tous les emails envoyés
   */
  async getEmailHistory() {
    return this.prisma.emailSent.findMany({
      orderBy: {
        sentAt: 'desc',
      },
    });
  }

  /**
   * Récupère tous les modèles d'emails
   */
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return this.prisma.emailTemplate.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * Crée ou met à jour un modèle d'email
   */
  async saveEmailTemplate(templateData: any) {
    const { id, name, subject, content, category, fromName, status } = templateData;

    if (id) {
      // Mise à jour d'un modèle existant
      return this.prisma.emailTemplate.update({
        where: { id },
        data: {
          name,
          subject,
          content,
          category,
          fromName,
          status,
          updatedAt: new Date(),
        },
      });
    } else {
      // Création d'un nouveau modèle
      return this.prisma.emailTemplate.create({
        data: {
          name,
          subject,
          content,
          category,
          fromName: fromName || 'DTAHC',
          status: status || 'ACTIVE',
        },
      });
    }
  }

  /**
   * Supprime un modèle d'email
   */
  async deleteEmailTemplate(id: string) {
    return this.prisma.emailTemplate.delete({
      where: { id },
    });
  }

  /**
   * Génère un aperçu d'email avec des variables de test
   */
  async generateEmailPreview(content: string, variables: Record<string, string> = {}): Promise<string> {
    let previewContent = content;
    
    // Remplacer les variables par des valeurs de test ou fournies
    const defaultVariables = {
      NOM_CLIENT: variables.NOM_CLIENT || 'Jean Dupont',
      ADRESSE_PROJET: variables.ADRESSE_PROJET || '15 rue de l\'exemple, 75000 Paris',
      REFERENCE: variables.REFERENCE || 'DOSS-2025-123',
      MONTANT_TTC: variables.MONTANT_TTC || '1500,00',
      DATE_VALIDITE: variables.DATE_VALIDITE || '31/12/2025',
      MONTANT_ACOMPTE: variables.MONTANT_ACOMPTE || '500,00',
      NOM_CONSEILLER: variables.NOM_CONSEILLER || 'Sophie Martin',
      TELEPHONE_CONSEILLER: variables.TELEPHONE_CONSEILLER || '01 23 45 67 89',
      // Ajouter d'autres variables par défaut au besoin
    };
    
    // Combiner les variables par défaut avec celles fournies
    const allVariables = { ...defaultVariables, ...variables };
    
    // Remplacer les variables dans le contenu
    Object.entries(allVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      previewContent = previewContent.replace(regex, value);
    });
    
    const siteName = this.configService.get<string>('SITE_NAME') || 'DTAHC';
    
    // Construire l'aperçu complet avec l'en-tête et le pied de page
    const fullPreview = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1D4ED8; padding: 20px; text-align: center; color: white; border-radius: 5px 5px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">${siteName}</h1>
        </div>
        
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; padding: 20px; border-radius: 0 0 5px 5px;">
          ${previewContent}
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.</p>
        </div>
      </div>
    `;
    
    return fullPreview;
  }
}