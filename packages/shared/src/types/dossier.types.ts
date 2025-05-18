export enum DossierType {
  DP = 'DP',
  PC = 'PC',
  PCMI = 'PCMI',
  PA = 'PA',
  AT_ERP = 'AT_ERP',
  DAACT = 'DAACT',
  DOE = 'DOE',
}

export enum WorkflowState {
  INITIAL = 'INITIAL',
  EN_PREPARATION = 'EN_PREPARATION',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  DEPOSE = 'DEPOSE',
  EN_INSTRUCTION = 'EN_INSTRUCTION',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  ANNULE = 'ANNULE',
  COMPLETE = 'COMPLETE',
}

export enum DossierStatus {
  NOUVEAU = 'NOUVEAU',
  EN_COURS = 'EN_COURS',
  EN_ATTENTE = 'EN_ATTENTE',
  TERMINE = 'TERMINE',
  ARCHIVE = 'ARCHIVE',
}

export enum Priority {
  FAIBLE = 'FAIBLE',
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
  CRITIQUE = 'CRITIQUE',
}

export interface Dossier {
  id: string;
  reference: string;
  title: string;
  description?: string | null;
  clientId: string;
  client?: any;
  type: DossierType;
  workflowState: WorkflowState;
  status: DossierStatus;
  priority: Priority;
  surfaceExistant?: number | null;
  surfaceProjet?: number | null;
  createdById: string;
  createdBy?: any;
  assignedToId?: string | null;
  assignedTo?: any;
  createdAt: string;
  updatedAt: string;
  deadline?: string | null;
  startDate?: string | null;
}

export interface CreateDossierDto {
  title: string;
  description?: string;
  clientId: string;
  type: DossierType;
  priority?: Priority;
  surfaceExistant?: number;
  surfaceProjet?: number;
  deadline?: string;
}