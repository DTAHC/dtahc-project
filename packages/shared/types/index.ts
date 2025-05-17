// Utilisateurs et authentification
export enum Role {
  ADMIN = 'ADMIN',
  COMPTABLE = 'COMPTABLE',
  GESTION = 'GESTION',
  PRODUCTION = 'PRODUCTION',
  CLIENT_PRO = 'CLIENT_PRO',
  USER = 'USER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Clients
export enum ClientType {
  PARTICULIER = 'PARTICULIER',
  ARCADIA = 'ARCADIA',
  COMBLE_DF = 'COMBLE_DF',
  MDT_ANTONY = 'MDT_ANTONY',
  ECA = 'ECA',
  LT_ARTISAN = 'LT_ARTISAN',
  SODERBAT = 'SODERBAT',
  COMBLESPACE = 'COMBLESPACE',
  MDT_C_ROBERT = 'MDT_C_ROBERT',
  MDT_YERRES = 'MDT_YERRES',
  MDT_ST_GEN = 'MDT_ST_GEN',
  B3C = 'B3C',
  TERRASSE_ET_JAR = 'TERRASSE_ET_JAR',
  RENOKEA = 'RENOKEA',
  GROUPE_APB = 'GROUPE_APB',
  PUREWATT = 'PUREWATT',
  S_AUGUSTO = 'S_AUGUSTO',
  TRAVAUX_3D = 'TRAVAUX_3D',
  BATI_PRESTO = 'BATI_PRESTO',
  CPHF = 'CPHF',
  MDT_FONT = 'MDT_FONT'
}

export enum AddressType {
  FACTURATION = 'FACTURATION',
  POSTAL = 'POSTAL',
  PROJECT = 'PROJECT'
}

export interface ContactInfo {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobilePhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  clientId: string;
  type: AddressType;
  street: string;
  complement?: string;
  postalCode: string;
  city: string;
  isProjectAddress: boolean;
  cadastralReference?: string;
  coordinates?: { latitude: number; longitude: number };
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  reference: string;
  clientType: ClientType;
  proReferenceId?: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  contactInfo?: ContactInfo;
  addresses?: Address[];
}

// Dossiers et workflow
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
  REALISATION_3D = 'REALISATION_3D'
}

export enum WorkflowState {
  INITIAL = 'INITIAL',
  ATTENTE_PIECE = 'ATTENTE_PIECE',
  ETUDE_APS = 'ETUDE_APS',
  DOSSIER_COMPLET = 'DOSSIER_COMPLET',
  RE_2020 = 'RE_2020',
  SIGNATURE_ARCHI = 'SIGNATURE_ARCHI'
}

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
  ACCEPTE = 'ACCEPTE'
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH'
}

export interface DossierCharacteristics {
  changementDestination: boolean;
  erp: boolean;
  demolition: boolean;
  travauxRealises: boolean;
}

export interface DossierWorkNature {
  constructionNeuve: boolean;
  extension: boolean;
  surelevation: boolean;
  modificationFacade: boolean;
  changementMenuiseries: boolean;
  amenagementExterieur: boolean;
  ite: boolean;
  piscine: boolean;
  panneauxSolaires: boolean;
  amenagementInterieur: boolean;
  refectionToiture: boolean;
  cloture: boolean;
}

export interface Dossier {
  id: string;
  reference: string;
  title: string;
  description?: string;
  clientId: string;
  type: DossierType;
  workflowState: WorkflowState;
  status: DossierStatus;
  priority: Priority;
  surfaceExistant?: number;
  surfaceProjet?: number;
  createdById: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  startDate?: string;
  submissionDate?: string;
  completionDate?: string;
  characteristics?: DossierCharacteristics;
  workNature?: DossierWorkNature;
}

// Documents
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

export enum DocumentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  type: DocumentType;
  path: string;
  size: number;
  mimeType: string;
  isRequired: boolean;
  isConfidential: boolean;
  status: DocumentStatus;
  clientId?: string;
  dossierId?: string;
  uploadedById: string;
  uploadedAt: string;
  updatedAt: string;
  version: number;
  parentId?: string;
  metadata?: any;
}

// Comptabilité
export enum AccountingType {
  DEVIS = 'DEVIS',
  FACTURE = 'FACTURE',
  ACOMPTE = 'ACOMPTE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  CHECK = 'CHECK',
  CASH = 'CASH',
  OTHER = 'OTHER'
}

export interface AccountingItem {
  id: string;
  accountingRecordId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  accountingRecordId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface AccountingRecord {
  id: string;
  type: AccountingType;
  status: PaymentStatus;
  reference?: string;
  amount: number;
  taxRate: number;
  dueDate?: string;
  clientId: string;
  dossierId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paidAmount?: number;
  paymentMethod?: PaymentMethod;
  description?: string;
  items?: AccountingItem[];
  payments?: Payment[];
}