/**
 * Type de formulaire
 */
export enum FormType {
  CLIENT_FORM = 'CLIENT_FORM',
  PROJECT_FORM = 'PROJECT_FORM',
  DOCUMENT_FORM = 'DOCUMENT_FORM', // Ajouté pour la compatibilité
  FEEDBACK_FORM = 'FEEDBACK_FORM'  // Ajouté pour la compatibilité
}

export interface FormLink {
  id: string;
  clientId: string;
  token: string;
  expiresAt: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  type: FormType;
  sentAt?: string;
  emailSent: boolean;
}