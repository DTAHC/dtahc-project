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
  MDT_FONT = 'MDT_FONT',
}

export enum AddressType {
  PRINCIPALE = 'PRINCIPALE',
  FACTURATION = 'FACTURATION',
  LIVRAISON = 'LIVRAISON',
  TRAVAUX = 'TRAVAUX',
}

export interface ContactInfo {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Address {
  id: string;
  clientId: string;
  type: AddressType;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Client {
  id: string;
  reference: string;
  clientType: ClientType;
  proReferenceId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  contactInfo?: ContactInfo;
  addresses?: Address[];
  dossiers?: Dossier[];
}

export interface CreateClientDto {
  clientType: ClientType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  proReferenceId?: string;
  street: string;
  city: string;
  postalCode: string;
}