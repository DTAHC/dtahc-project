// Types partagés générés à partir du schéma Prisma

// Re-export des types depuis leurs fichiers respectifs
export * from './types/client.types';
export * from './types/dossier.types';
export * from './types/form-link.types';

/**
 * Rôles utilisateur
 */
export enum Role {
  ADMIN = 'ADMIN',
  COMPTABLE = 'COMPTABLE',
  GESTION = 'GESTION',
  PRODUCTION = 'PRODUCTION',
  CLIENT_PRO = 'CLIENT_PRO',
  USER = 'USER'
}

/**
 * Statut de l'utilisateur
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

/**
 * Statut de tâche
 */
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED'
}

/**
 * Type de document
 */
export enum DocumentType {
  PHOTO_PRES = 'PHOTO_PRES',
  PHOTO_LOIN = 'PHOTO_LOIN',
  PLAN = 'PLAN',
  CERFA = 'CERFA',
  NOTICE = 'NOTICE',
  CADASTRE = 'CADASTRE',
  PLU = 'PLU',
  ETUDE_THERMIQUE = 'ETUDE_THERMIQUE',
  FACTURE = 'FACTURE',
  DEVIS = 'DEVIS',
  CONTRAT = 'CONTRAT',
  AUTRE = 'AUTRE'
}

/**
 * Statut de document
 */
export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * Type de notification
 */
export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

/**
 * Type comptable
 */
export enum AccountingType {
  DEVIS = 'DEVIS',
  FACTURE = 'FACTURE',
  ACOMPTE = 'ACOMPTE'
}

/**
 * Statut de paiement
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

/**
 * Méthode de paiement
 */
export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CHECK = 'CHECK',
  CASH = 'CASH',
  OTHER = 'OTHER'
}

// Interface utilisateur
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}