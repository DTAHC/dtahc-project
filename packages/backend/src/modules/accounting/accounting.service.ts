import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAccountingRecordDto } from './dto/create-accounting-record.dto';
import { AccountingType, PaymentStatus } from '@prisma/client';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountingRecordDto: CreateAccountingRecordDto) {
    // Vérifier si le client existe
    const clientExists = await this.prisma.client.findUnique({
      where: { id: createAccountingRecordDto.clientId },
    });

    if (!clientExists) {
      throw new NotFoundException(`Client avec l'ID ${createAccountingRecordDto.clientId} non trouvé`);
    }

    // Vérifier si le dossier existe (si fourni)
    if (createAccountingRecordDto.dossierId) {
      const dossierExists = await this.prisma.dossier.findUnique({
        where: { id: createAccountingRecordDto.dossierId },
      });

      if (!dossierExists) {
        throw new NotFoundException(`Dossier avec l'ID ${createAccountingRecordDto.dossierId} non trouvé`);
      }
    }

    // Générer la référence si non fournie
    if (!createAccountingRecordDto.reference) {
      const prefix = createAccountingRecordDto.type === AccountingType.FACTURE ? 'FAC' : 
                     createAccountingRecordDto.type === AccountingType.DEVIS ? 'DEV' : 'ACC';
      const year = new Date().getFullYear();
      
      // Trouver le dernier numéro de séquence
      const lastRecord = await this.prisma.accountingRecord.findFirst({
        where: {
          reference: {
            startsWith: `${prefix}-${year}`,
          },
        },
        orderBy: {
          reference: 'desc',
        },
      });

      let sequenceNumber = 1;
      if (lastRecord && lastRecord.reference) {
        const parts = lastRecord.reference.split('-');
        if (parts.length === 3) {
          sequenceNumber = parseInt(parts[2], 10) + 1;
        }
      }

      createAccountingRecordDto.reference = `${prefix}-${year}-${String(sequenceNumber).padStart(3, '0')}`;
    }

    return this.prisma.accountingRecord.create({
      data: {
        type: createAccountingRecordDto.type,
        status: createAccountingRecordDto.status || PaymentStatus.PENDING,
        reference: createAccountingRecordDto.reference,
        amount: createAccountingRecordDto.amount,
        taxRate: createAccountingRecordDto.taxRate || 20,
        dueDate: createAccountingRecordDto.dueDate ? new Date(createAccountingRecordDto.dueDate) : undefined,
        clientId: createAccountingRecordDto.clientId,
        dossierId: createAccountingRecordDto.dossierId,
        description: createAccountingRecordDto.description,
        createdById: 'user-id-placeholder', // À remplacer par l'ID de l'utilisateur authentifié
      },
    });
  }

  async findAll(filters: { type?: string; status?: string; clientId?: string }) {
    const { type, status, clientId } = filters;
    
    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (clientId) {
      where.clientId = clientId;
    }
    
    return this.prisma.accountingRecord.findMany({
      where,
      include: {
        client: {
          select: {
            reference: true,
            contactInfo: true,
          },
        },
        dossier: {
          select: {
            reference: true,
            title: true,
          },
        },
        items: true,
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.accountingRecord.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            reference: true,
            contactInfo: true,
            addresses: true,
          },
        },
        dossier: {
          select: {
            reference: true,
            title: true,
            type: true,
          },
        },
        items: true,
        payments: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Document comptable avec l'ID ${id} non trouvé`);
    }

    return record;
  }

  async update(id: string, updateData: any) {
    // Vérifier si le document existe
    const exists = await this.prisma.accountingRecord.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Document comptable avec l'ID ${id} non trouvé`);
    }

    return this.prisma.accountingRecord.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    // Vérifier si le document existe
    const exists = await this.prisma.accountingRecord.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Document comptable avec l'ID ${id} non trouvé`);
    }

    // Supprimer les lignes et paiements associés
    await this.prisma.$transaction([
      this.prisma.accountingItem.deleteMany({
        where: { accountingRecordId: id },
      }),
      this.prisma.payment.deleteMany({
        where: { accountingRecordId: id },
      }),
      this.prisma.accountingRecord.delete({
        where: { id },
      }),
    ]);

    return { id };
  }

  async addPayment(id: string, paymentData: any) {
    // Vérifier si le document existe
    const record = await this.prisma.accountingRecord.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!record) {
      throw new NotFoundException(`Document comptable avec l'ID ${id} non trouvé`);
    }

    // Créer le paiement
    const payment = await this.prisma.payment.create({
      data: {
        accountingRecordId: id,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate || new Date(),
        reference: paymentData.reference,
        notes: paymentData.notes,
      },
    });

    // Mettre à jour le statut du document
    const totalPaid = record.payments.reduce((sum, p) => sum + p.amount, 0) + paymentData.amount;
    
    let newStatus: PaymentStatus = PaymentStatus.PENDING;
    
    if (totalPaid >= record.amount) {
      newStatus = 'PAID' as PaymentStatus;
    } else if (totalPaid > 0) {
      newStatus = 'PARTIAL' as PaymentStatus;
    }

    await this.prisma.accountingRecord.update({
      where: { id },
      data: {
        status: newStatus,
        paidAmount: totalPaid,
        paidAt: newStatus === 'PAID' as PaymentStatus ? new Date() : null,
      },
    });

    return payment;
  }

  async getStatsSummary() {
    // Nombre de factures par statut
    const statusCounts = await this.prisma.accountingRecord.groupBy({
      by: ['status'],
      _count: true,
    });

    // Montant total facturé et payé
    const totals = await this.prisma.$queryRaw`
      SELECT 
        SUM(amount) as totalAmount,
        SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) as totalPaid,
        SUM(CASE WHEN status = 'PARTIAL' THEN "paidAmount" ELSE 0 END) as totalPartialPaid
      FROM "AccountingRecord"
      WHERE type = 'FACTURE'
    `;

    // Factures en retard
    const now = new Date();
    const overdueCount = await this.prisma.accountingRecord.count({
      where: {
        type: AccountingType.FACTURE,
        status: {
          in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL],
        },
        dueDate: {
          lt: now,
        },
      },
    });

    // Données par période (année en cours)
    const currentYear = now.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    
    const monthlyData = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM "createdAt") as month,
        COUNT(*) as count,
        SUM(amount) as totalAmount,
        SUM(CASE WHEN status = 'PAID' THEN amount ELSE 0 END) as paidAmount
      FROM "AccountingRecord"
      WHERE type = 'FACTURE'
        AND "createdAt" >= ${firstDayOfYear}
      GROUP BY EXTRACT(MONTH FROM "createdAt")
      ORDER BY month
    `;

    return {
      statusCounts,
      totals,
      overdueCount,
      monthlyData,
    };
  }
}