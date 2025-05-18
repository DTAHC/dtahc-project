import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateDossierDto } from '../dto/create-dossier.dto';
import { Dossier } from '@prisma/client';

@Injectable()
export class DossiersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère une référence unique pour un dossier au format DOS-YYYY-XXX
   */
  private async generateDossierReference(): Promise<string> {
    const currentYear = new Date().getFullYear();
    
    // Récupérer le dernier dossier créé cette année
    const lastDossier = await this.prisma.dossier.findFirst({
      where: {
        reference: {
          startsWith: `DOS-${currentYear}`,
        },
      },
      orderBy: {
        reference: 'desc',
      },
    });

    let nextNumber = 1;
    
    if (lastDossier) {
      const lastNumber = parseInt(lastDossier.reference.split('-')[2]);
      nextNumber = lastNumber + 1;
    }
    
    // Formater le numéro avec des zéros de remplissage
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    return `DOS-${currentYear}-${formattedNumber}`;
  }

  /**
   * Crée un nouveau dossier
   */
  async create(createDossierDto: CreateDossierDto, userId: string): Promise<Dossier> {
    const { 
      title, 
      description, 
      clientId, 
      type, 
      priority, 
      surfaceExistant, 
      surfaceProjet, 
      deadline 
    } = createDossierDto;

    // Générer une référence unique
    const reference = await this.generateDossierReference();

    return this.prisma.dossier.create({
      data: {
        reference,
        title,
        description,
        clientId,
        type,
        priority: priority || 'NORMAL',
        surfaceExistant,
        surfaceProjet,
        deadline: deadline ? new Date(deadline) : null,
        createdById: userId,
      },
      include: {
        client: {
          include: {
            contactInfo: true,
          },
        },
      },
    });
  }

  /**
   * Récupère tous les dossiers
   */
  async findAll(): Promise<Dossier[]> {
    return this.prisma.dossier.findMany({
      include: {
        client: {
          include: {
            contactInfo: true,
          },
        },
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Récupère les dossiers d'un client
   */
  async findByClient(clientId: string): Promise<Dossier[]> {
    return this.prisma.dossier.findMany({
      where: {
        clientId,
      },
      include: {
        client: {
          include: {
            contactInfo: true,
          },
        },
        assignedTo: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Récupère un dossier par son ID
   */
  async findOne(id: string): Promise<Dossier | null> {
    return this.prisma.dossier.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            contactInfo: true,
            addresses: true,
          },
        },
        assignedTo: true,
        createdBy: true,
      },
    });
  }
}