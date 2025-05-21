/**
 * Priorité
 */
export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  FAIBLE = 'FAIBLE',    // Alias pour la compatibilité
  URGENT = 'HIGH',      // Alias pour la compatibilité
  CRITIQUE = 'HIGH'     // Alias pour la compatibilité
}

export enum DossierType {
  DP = 'DP',
  DP_MUR = 'DP_MUR',
  DP_ITE = 'DP_ITE',
  DP_FENETRE = 'DP_FENETRE',
  DP_PISCINE = 'DP_PISCINE',
  DP_SOLAIRE = 'DP_SOLAIRE',
  PC_RT = 'PC_RT',
  PC_RT_SIGNATURE = 'PC_RT_SIGNATURE',
  PC_MODIF = 'PC_MODIF',
  ERP = 'ERP',
  FENETRE_ITE = 'FENETRE_ITE',
  PLAN_DE_MASSE = 'PLAN_DE_MASSE',
  PAC = 'PAC',
  REALISATION_3D = 'REALISATION_3D',
}

export enum WorkflowState {
  INITIAL = 'INITIAL',
  ATTENTE_PIECE = 'ATTENTE_PIECE',
  ETUDE_APS = 'ETUDE_APS',
  DOSSIER_COMPLET = 'DOSSIER_COMPLET',
  RE_2020 = 'RE_2020',
  SIGNATURE_ARCHI = 'SIGNATURE_ARCHI',
}

/**
 * Statut du dossier
 */
export enum DossierStatus {
  NOUVEAU = 'NOUVEAU',
  LIVRE_CLIENT = 'LIVRE_CLIENT',
  DEPOT_EN_LIGNE = 'DEPOT_EN_LIGNE',
  TOP_URGENT = 'TOP_URGENT',
  ANNULE = 'ANNULE',
  INCOMPLETUDE_MAIRIE = 'INCOMPLETUDE_MAIRIE',
  REFUS = 'REFUS',
  A_DEPOSER_EN_LIGNE = 'A_DEPOSER_EN_LIGNE',
  A_ENVOYER_AU_CLIENT = 'A_ENVOYER_AU_CLIENT',
  EN_INSTRUCTION = 'EN_INSTRUCTION',
  ACCEPTE = 'ACCEPTE',
  // États supplémentaires utilisés dans le frontend
  EN_COURS = 'EN_COURS',
  EN_ATTENTE = 'EN_ATTENTE',
  TERMINE = 'TERMINE',
  ARCHIVE = 'ARCHIVE'
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