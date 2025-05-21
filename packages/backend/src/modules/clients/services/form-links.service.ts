import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmailsService } from '../../emails/emails.service';
import { FormType } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class FormLinksService {
  private readonly logger = new Logger(FormLinksService.name);

  constructor(
    private prisma: PrismaService,
    private emailsService: EmailsService,
  ) {}

  /**
   * Génère un token aléatoire sécurisé
   */
  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Crée un nouveau lien de formulaire pour un client
   */
  async createFormLink(clientId: string, type: FormType = FormType.CLIENT_FORM) {
    // Vérifier si le client existe
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { contactInfo: true },
    });

    if (!client) {
      throw new NotFoundException(`Client avec l'id ${clientId} non trouvé`);
    }

    // Vérifier si un lien actif existe déjà pour ce client et ce type de formulaire
    const existingLink = await this.prisma.formLink.findFirst({
      where: {
        clientId,
        type,
        expiresAt: { gt: new Date() },
        completed: false,
      },
    });

    // Si un lien existe et est toujours valide, retourner celui-ci
    if (existingLink) {
      return existingLink;
    }

    // Sinon, créer un nouveau lien
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Valide 7 jours

    const formLink = await this.prisma.formLink.create({
      data: {
        clientId,
        token,
        expiresAt,
        type,
      },
    });

    this.logger.log(`Nouveau lien de formulaire créé pour le client ${clientId}`);
    return formLink;
  }

  /**
   * Envoie un email avec le lien du formulaire au client
   */
  async sendFormLinkByEmail(formLinkId: string): Promise<boolean> {
    // Récupérer le formLink avec les infos client
    const formLink = await this.prisma.formLink.findUnique({
      where: { id: formLinkId },
      include: {
        client: {
          include: { contactInfo: true },
        },
      },
    });

    if (!formLink) {
      throw new NotFoundException(`Lien de formulaire avec l'id ${formLinkId} non trouvé`);
    }

    if (!formLink.client.contactInfo) {
      this.logger.error(`Le client ${formLink.clientId} n'a pas d'informations de contact`);
      return false;
    }

    // Envoyer l'email
    const { email, firstName, lastName } = formLink.client.contactInfo;
    const emailResult = await this.emailsService.sendClientFormLink(
      email,
      firstName,
      lastName,
      formLink.token,
    );

    if (emailResult) {
      // Mettre à jour le formLink pour indiquer que l'email a été envoyé
      await this.prisma.formLink.update({
        where: { id: formLinkId },
        data: {
          emailSent: true,
          sentAt: new Date(),
        },
      });
    }

    return emailResult;
  }

  /**
   * Renvoie un email avec le lien du formulaire au client
   */
  async resendFormLink(clientId: string): Promise<boolean> {
    // Vérifier si le client existe avec ses infos de contact
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { contactInfo: true },
    });

    if (!client || !client.contactInfo) {
      throw new NotFoundException(`Client avec l'id ${clientId} non trouvé ou sans infos de contact`);
    }

    // Créer ou récupérer un lien de formulaire
    const formLink = await this.createFormLink(clientId);

    // Envoyer l'email
    const { email, firstName, lastName } = client.contactInfo;
    const emailResult = await this.emailsService.sendClientFormLink(
      email,
      firstName,
      lastName,
      formLink.token,
    );

    if (emailResult) {
      // Mettre à jour le formLink pour indiquer que l'email a été renvoyé
      await this.prisma.formLink.update({
        where: { id: formLink.id },
        data: {
          emailSent: true,
          sentAt: new Date(),
        },
      });
    }

    return emailResult;
  }

  /**
   * Vérifie si un token est valide et récupère les informations du client associé
   */
  async validateToken(token: string) {
    const formLink = await this.prisma.formLink.findUnique({
      where: { token },
      include: {
        client: {
          include: { contactInfo: true },
        },
      },
    });

    if (!formLink) {
      throw new NotFoundException('Lien de formulaire non valide ou expiré');
    }

    // Vérifier si le lien est expiré
    if (formLink.expiresAt < new Date()) {
      throw new NotFoundException('Ce lien a expiré');
    }

    // Vérifier si le formulaire a déjà été complété
    if (formLink.completed) {
      throw new NotFoundException('Ce formulaire a déjà été complété');
    }

    return {
      formLink,
      client: formLink.client,
    };
  }

  /**
   * Marquer un formulaire comme complété
   */
  async markFormAsCompleted(token: string) {
    const formLink = await this.prisma.formLink.findUnique({
      where: { token },
      include: { client: { include: { contactInfo: true } } },
    });

    if (!formLink) {
      throw new NotFoundException('Lien de formulaire non valide');
    }

    // Mettre à jour le statut du formulaire
    const updatedFormLink = await this.prisma.formLink.update({
      where: { id: formLink.id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    return updatedFormLink;
  }

  /**
   * Récupère tous les liens de formulaires pour un client
   */
  async getFormLinksByClient(clientId: string) {
    return this.prisma.formLink.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}