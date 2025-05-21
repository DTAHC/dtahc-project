import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { FormLinksService } from './form-links.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { Client, FormType } from '@prisma/client';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private prisma: PrismaService,
    private formLinksService: FormLinksService,
  ) {}

  /**
   * Génère une référence unique pour un client au format CL-YYYY-XXX
   */
  private async generateClientReference(): Promise<string> {
    const currentYear = new Date().getFullYear();
    
    // Récupérer le dernier client créé cette année
    const lastClient = await this.prisma.client.findFirst({
      where: {
        reference: {
          startsWith: `CL-${currentYear}`,
        },
      },
      orderBy: {
        reference: 'desc',
      },
    });

    let nextNumber = 1;
    
    if (lastClient) {
      const lastNumber = parseInt(lastClient.reference.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    
    // Formater le numéro avec des zéros de remplissage
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    return `CL-${currentYear}-${formattedNumber}`;
  }

  /**
   * Crée un nouveau client avec un mode simplifié ou complet
   */
  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        clientType, 
        proReferenceId,
        street,
        city,
        postalCode,
        sendFormLink
      } = createClientDto;

      this.logger.log(`Creating client with data: ${JSON.stringify({
        firstName, lastName, email, clientType, sendFormLink
      })}`);
      
      // Générer une référence unique
      const reference = await this.generateClientReference();
      
      // Créer le client avec ses informations associées en une seule transaction
      const client = await this.prisma.$transaction(async (tx) => {
        // Créer le client avec les informations minimales
        const clientData: any = {
          reference,
          clientType,
          proReferenceId,
          createdById: userId,
          contactInfo: {
            create: {
              firstName,
              lastName,
              email,
              phone: phone || '',
            },
          },
        };

        // Ajouter l'adresse si elle est fournie
        if (street && city && postalCode) {
          clientData.addresses = {
            create: {
              type: 'POSTAL',
              street,
              city,
              postalCode,
            },
          };
        }

        const newClient = await tx.client.create({
          data: clientData,
          include: {
            contactInfo: true,
            addresses: true,
          },
        });

        this.logger.log(`Client créé avec succès: ${newClient.id}`);
        return newClient;
      });

      // Si demandé, créer et envoyer un lien de formulaire
      if (sendFormLink && client) {
        try {
          const formLink = await this.formLinksService.createFormLink(client.id, FormType.CLIENT_FORM);
          await this.formLinksService.sendFormLinkByEmail(formLink.id);
          this.logger.log(`Lien de formulaire envoyé au client ${client.id}`);
        } catch (error) {
          this.logger.error(`Erreur lors de l'envoi du lien de formulaire: ${error.message}`);
          // On continue malgré l'erreur d'envoi d'email, le client est déjà créé
        }
      }

      return client;
    } catch (error) {
      this.logger.error(`Erreur lors de la création du client: ${error.message}`);
      throw error;
    }
  }

  /**
   * Récupère tous les clients
   */
  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany({
      include: {
        contactInfo: true,
        addresses: true,
        dossiers: true,
        formLinks: {
          where: {
            type: FormType.CLIENT_FORM,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  /**
   * Récupère un client par son ID
   */
  async findOne(id: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        contactInfo: true,
        addresses: true,
        dossiers: true,
        formLinks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Cherche des clients par nom, prénom ou email
   */
  async search(query: string): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: {
        OR: [
          {
            contactInfo: {
              firstName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            contactInfo: {
              lastName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            contactInfo: {
              email: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            reference: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        contactInfo: true,
        addresses: true,
        formLinks: {
          where: {
            type: FormType.CLIENT_FORM,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  /**
   * Met à jour les informations d'un client depuis le formulaire public
   */
  async updateClientFromForm(clientId: string, formData: any): Promise<Client> {
    const { contactInfo, address, additionalInfo } = formData;

    return this.prisma.$transaction(async (tx) => {
      // Mettre à jour les informations de contact
      await tx.contactInfo.update({
        where: { clientId },
        data: contactInfo,
      });

      // Vérifier si une adresse existe déjà
      const existingAddress = await tx.address.findFirst({
        where: { 
          clientId,
          type: 'POSTAL',
        },
      });

      // Créer ou mettre à jour l'adresse
      if (existingAddress) {
        await tx.address.update({
          where: { id: existingAddress.id },
          data: {
            ...address,
            type: 'POSTAL',
          },
        });
      } else {
        await tx.address.create({
          data: {
            ...address,
            type: 'POSTAL',
            clientId,
          },
        });
      }

      // Si des informations supplémentaires sont fournies, les stocker dans un document
      if (additionalInfo) {
        // Logique pour stocker des informations additionnelles si nécessaire
      }

      // Retourner le client mis à jour
      const updatedClient = await tx.client.findUnique({
        where: { id: clientId },
        include: {
          contactInfo: true,
          addresses: true,
        },
      });
      
      if (!updatedClient) {
        throw new Error(`Client with ID ${clientId} not found after update`);
      }
      
      return updatedClient;
    });
  }

  /**
   * Renvoie un lien de formulaire à un client existant
   */
  async resendFormLink(clientId: string): Promise<boolean> {
    return this.formLinksService.resendFormLink(clientId);
  }

  /**
   * Met à jour les informations d'un client
   */
  async update(id: string, updateData: any): Promise<Client> {
    this.logger.log(`Mise à jour du client: ${id}`);

    const client = await this.prisma.$transaction(async (tx) => {
      // Mise à jour des informations de base du client
      let updatedClient = await tx.client.update({
        where: { id },
        data: {
          clientType: updateData.clientType,
          proReferenceId: updateData.proReferenceId,
        },
        include: {
          contactInfo: true,
          addresses: true,
        },
      });

      // Mise à jour des informations de contact si fournies
      if (updateData.contactInfo) {
        await tx.contactInfo.update({
          where: { clientId: id },
          data: updateData.contactInfo,
        });
      }

      // Mise à jour des adresses si fournies
      if (updateData.addresses && updateData.addresses.length > 0) {
        const address = updateData.addresses[0];
        
        // Vérifier si une adresse existe déjà
        const existingAddress = await tx.address.findFirst({
          where: { clientId: id },
        });

        if (existingAddress) {
          // Mettre à jour l'adresse existante
          await tx.address.update({
            where: { id: existingAddress.id },
            data: address,
          });
        } else {
          // Créer une nouvelle adresse
          await tx.address.create({
            data: {
              ...address,
              clientId: id,
            },
          });
        }
      }

      // Récupérer le client mis à jour avec toutes ses relations
      const result = await tx.client.findUnique({
        where: { id },
        include: {
          contactInfo: true,
          addresses: true,
          dossiers: true,
          formLinks: true,
        },
      });
      
      if (!result) {
        throw new Error(`Client with ID ${id} not found after update`);
      }
      
      return result;
    });
    
    return client;
  }

  /**
   * Supprime un client
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Suppression du client: ${id}`);

    await this.prisma.$transaction(async (tx) => {
      // Supprimer les liens de formulaire associés
      await tx.formLink.deleteMany({
        where: { clientId: id },
      });

      // Supprimer les informations de contact
      await tx.contactInfo.delete({
        where: { clientId: id },
      }).catch(() => {
        this.logger.log(`Aucune information de contact à supprimer pour le client ${id}`);
      });

      // Supprimer les adresses
      await tx.address.deleteMany({
        where: { clientId: id },
      });

      // Supprimer le client lui-même
      await tx.client.delete({
        where: { id },
      });
    });
  }
}