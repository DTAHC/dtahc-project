import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

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
   * Crée un nouveau client avec ses informations de contact et adresse
   */
  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      clientType, 
      proReferenceId,
      street,
      city,
      postalCode
    } = createClientDto;

    // Générer une référence unique
    const reference = await this.generateClientReference();

    // Créer le client avec ses informations associées en une seule transaction
    return this.prisma.$transaction(async (tx) => {
      // Créer le client
      const client = await tx.client.create({
        data: {
          reference,
          clientType,
          proReferenceId,
          createdById: userId,
          contactInfo: {
            create: {
              firstName,
              lastName,
              email,
              phone,
            },
          },
          addresses: {
            create: {
              type: 'PRINCIPALE',
              street,
              city,
              postalCode,
              country: 'France',
            },
          },
        },
        include: {
          contactInfo: true,
          addresses: true,
        },
      });

      return client;
    });
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
        ],
      },
      include: {
        contactInfo: true,
        addresses: true,
      },
    });
  }
}