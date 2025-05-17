import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { AccountingType, PaymentStatus } from '@prisma/client';

export class CreateAccountingRecordDto {
  @ApiProperty({
    description: 'Type du document comptable',
    enum: AccountingType,
    example: AccountingType.FACTURE,
  })
  @IsEnum(AccountingType)
  @IsNotEmpty()
  type: AccountingType;

  @ApiProperty({
    description: 'Statut du paiement',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Numéro de référence (facture ou devis)',
    example: 'FAC-2023-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiProperty({
    description: 'Montant total',
    example: 1250.50,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Taux de TVA',
    example: 20,
    default: 20,
  })
  @IsNumber()
  @IsOptional()
  taxRate?: number;

  @ApiProperty({
    description: 'Date d\'échéance',
    example: '2023-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'ID du client',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'ID du dossier lié',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  dossierId?: string;

  @ApiProperty({
    description: 'Description du document comptable',
    example: 'Facture pour le dossier de permis de construire',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}